// ギフト司法書士事務所
// 顧客マスタ（App229）フィールド一括投入スクリプト
// kintoneのJavaScriptカスタマイズとして実行する

(function() {
  'use strict';

  // ── フィールド定義 ──────────────────────────────
  const FIELDS = {
    customer_name: {
      type: 'SINGLE_LINE_TEXT',
      code: 'customer_name',
      label: '顧客名',
      required: true,
      noLabel: false,
    },
    customer_kana: {
      type: 'SINGLE_LINE_TEXT',
      code: 'customer_kana',
      label: 'フリガナ',
      required: false,
    },
    customer_type: {
      type: 'DROP_DOWN',
      code: 'customer_type',
      label: '顧客種別',
      required: true,
      options: {
        '社会福祉法人': { label: '社会福祉法人', index: '0' },
        '学校法人':     { label: '学校法人',     index: '1' },
        '株式会社':     { label: '株式会社',     index: '2' },
        '有限会社':     { label: '有限会社',     index: '3' },
        '一般社団法人': { label: '一般社団法人', index: '4' },
        '一般財団法人': { label: '一般財団法人', index: '5' },
        'NPO法人':      { label: 'NPO法人',      index: '6' },
        '個人':         { label: '個人',         index: '7' },
        '個人（被相続人）': { label: '個人（被相続人）', index: '8' },
        'その他':       { label: 'その他',       index: '9' },
      },
      defaultValue: '',
    },
    corp_number: {
      type: 'SINGLE_LINE_TEXT',
      code: 'corp_number',
      label: '法人番号',
      required: false,
    },
    zip: {
      type: 'SINGLE_LINE_TEXT',
      code: 'zip',
      label: '郵便番号',
      required: false,
    },
    pref: {
      type: 'SINGLE_LINE_TEXT',
      code: 'pref',
      label: '都道府県',
      required: false,
    },
    city: {
      type: 'SINGLE_LINE_TEXT',
      code: 'city',
      label: '市区町村',
      required: false,
    },
    street: {
      type: 'SINGLE_LINE_TEXT',
      code: 'street',
      label: '番地以下',
      required: false,
    },
    tel: {
      type: 'SINGLE_LINE_TEXT',
      code: 'tel',
      label: '電話番号',
      required: false,
    },
    email: {
      type: 'SINGLE_LINE_TEXT',
      code: 'email',
      label: 'メールアドレス',
      required: false,
    },
    referrer: {
      type: 'SINGLE_LINE_TEXT',
      code: 'referrer',
      label: '紹介元',
      required: false,
    },
    referrer_staff: {
      type: 'SINGLE_LINE_TEXT',
      code: 'referrer_staff',
      label: '紹介元担当者',
      required: false,
    },
    chatwork_room_id: {
      type: 'SINGLE_LINE_TEXT',
      code: 'chatwork_room_id',
      label: 'chatworkRoomId',
      required: false,
    },
    status: {
      type: 'DROP_DOWN',
      code: 'status',
      label: 'ステータス',
      required: true,
      options: {
        '有効': { label: '有効', index: '0' },
        '休止': { label: '休止', index: '1' },
        '解約': { label: '解約', index: '2' },
      },
      defaultValue: '有効',
    },
    notes: {
      type: 'MULTI_LINE_TEXT',
      code: 'notes',
      label: '備考',
      required: false,
    },
  };

  // ── ボタンを画面に表示 ──────────────────────────
  kintone.events.on('app.record.index.show', function(event) {
    // すでにボタンがあれば追加しない
    if (document.getElementById('gift-setup-btn')) return event;

    const btn = document.createElement('button');
    btn.id = 'gift-setup-btn';
    btn.textContent = '🔧 フィールドを一括投入する';
    btn.style.cssText = [
      'background:#2a5bd7', 'color:#fff', 'border:none',
      'padding:8px 16px', 'border-radius:6px', 'font-size:13px',
      'cursor:pointer', 'margin-left:8px', 'font-weight:600',
    ].join(';');

    btn.addEventListener('click', async function() {
      if (!confirm('顧客マスタにフィールドを一括追加します。よろしいですか？')) return;

      btn.disabled = true;
      btn.textContent = '⏳ 投入中...';

      try {
        const appId = kintone.app.getId();

        // フィールドを追加（プレビュー環境に投入）
        const res = await kintone.api(
          kintone.api.url('/k/v1/preview/app/form/fields', true),
          'POST',
          { app: appId, properties: FIELDS }
        );

        console.log('フィールド追加結果:', res);

        // アプリを更新（プレビュー→本番に反映）
        const deployRes = await kintone.api(
          kintone.api.url('/k/v1/preview/app/deploy', true),
          'POST',
          { apps: [{ app: appId }] }
        );

        console.log('デプロイ結果:', deployRes);

        alert('✅ フィールドの投入が完了しました！\nページを更新してフィールドを確認してください。');
        btn.textContent = '✅ 完了';

      } catch(err) {
        console.error('エラー:', err);
        const msg = err.message || JSON.stringify(err);
        alert('❌ エラーが発生しました:\n' + msg + '\n\nすでに同じフィールドが存在する場合はこのエラーが出ます。kintoneのフォーム設定を確認してください。');
        btn.disabled = false;
        btn.textContent = '🔧 フィールドを一括投入する';
      }
    });

    // ヘッダーメニューにボタンを追加
    const headerSpace = kintone.app.getHeaderMenuSpaceElement();
    if (headerSpace) {
      headerSpace.appendChild(btn);
    }

    return event;
  });

})();
