/// <reference path="../pb_data/types.d.ts" />
// ==========================================================
// HOOK POCKETBASE — t'envoie un e-mail à chaque nouveau message
// ----------------------------------------------------------
// Pour que l'envoi marche, configure le SMTP dans l'admin :
// Settings → Mail settings (serveur SMTP Infomaniak, Gmail…).
// Le destinataire est la variable d'environnement CONTACT_TO,
// sinon l'e-mail de la fiche « site », sinon l'expéditeur.
// Si l'e-mail échoue, le message reste quand même enregistré.
// ==========================================================

onRecordAfterCreateSuccess((e) => {
  try {
    const esc = (s) => String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const meta = e.app.settings().meta;

    let to = $os.getenv('CONTACT_TO');
    if (!to) {
      try { to = e.app.findFirstRecordByFilter('site', "email != ''").getString('email'); } catch (_) {}
    }
    if (!to) to = meta.senderAddress;

    const r = e.record;
    const html =
      '<h2>Nouveau message — Canal BF</h2>' +
      '<p><strong>' + esc(r.getString('prenom')) + ' ' + esc(r.getString('nom')) + '</strong> — ' +
      '<a href="mailto:' + esc(r.getString('email')) + '">' + esc(r.getString('email')) + '</a></p>' +
      '<p style="white-space:pre-wrap">' + esc(r.getString('message')) + '</p>';

    const message = new MailerMessage({
      from: { address: meta.senderAddress, name: meta.senderName || 'Canal BF' },
      to: [{ address: to }],
      headers: { 'Reply-To': r.getString('email') }, // « Répondre » répond directement à la personne
      subject: 'Canal BF — message de ' + r.getString('prenom') + ' ' + r.getString('nom'),
      html: html,
    });
    e.app.newMailClient().send(message);
  } catch (err) {
    e.app.logger().error('Envoi de la notification impossible', 'error', String(err));
  }
  e.next();
}, 'messages');
