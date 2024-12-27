import { storage } from '/js/common-utils.js';

export function setPageCooserEvents() {
  $('.chooser').click(async function () {
    var panel = $(this).attr('id');
    if ($(this).hasClass('selected')) return;
    var id = $(this).attr('id');
    if (id == 'getting_started') {
      openExtPage('http://www.editthiscookie.com/start/');
      return;
    } else if (id == 'help') {
      openExtPage('http://www.editthiscookie.com/faq/');
      return;
    }
    await storage.set('option_panel', panel);
    location.href = '/options_pages/' + id + '.html';
  });
}

function openExtPage(url) {
  chrome.tabs.getCurrent(function (tab) {
    chrome.tabs.create({
      index: tab.index + 1,
      url: url,
      active: true,
      openerTabId: tab.id,
    });
  });
}
