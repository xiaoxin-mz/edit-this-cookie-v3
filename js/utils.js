import { deleteCookie } from '/js/cookie_helpers.js';

export function getHost(url) {
  return url.match(/:\/\/(.[^:/]+)/)[1].replace('www.', '');
}

export function addBlockRule(data, rule) {
  var dfilters = data.filters;
  for (var x = 0; x < dfilters.length; x++) {
    var currFilter = dfilters[x];
    if ((currFilter.domain !== null) === (rule.domain !== null)) {
      if (currFilter.domain !== rule.domain) {
        continue;
      }
    } else {
      continue;
    }
    if ((currFilter.name !== null) === (rule.name !== null)) {
      if (currFilter.name !== rule.name) {
        continue;
      }
    } else {
      continue;
    }
    if ((currFilter.value !== null) === (rule.value !== null)) {
      if (currFilter.value !== rule.value) {
        continue;
      }
    } else {
      continue;
    }
    return x;
  }
  dfilters[dfilters.length] = rule;
  data.filters = dfilters;
  const filterURL = {};

  if (rule.name !== undefined) {
    filterURL.name = rule.name;
  }
  if (rule.value !== undefined) {
    filterURL.value = rule.value;
  }
  if (rule.domain !== undefined) {
    filterURL.domain = rule.domain;
  }
  chrome.cookies.getAll({}, function (cookieL) {
    for (var x = 0; x < cookieL.length; x++) {
      var cCookie = cookieL[x];
      if (filterMatchesCookie(filterURL, cCookie.name, cCookie.domain, cCookie.value)) {
        var cUrl = cCookie.secure ? 'https://' : 'http://' + cCookie.domain + cCookie.path;
        deleteCookie(cUrl, cCookie.name, cCookie.storeId, cCookie);
      }
    }
  });
}

export function switchReadOnlyRule(data, rule) {
  var added = true;
  var readOnlyList = data.readOnly;
  for (var x = 0; x < readOnlyList.length; x++) {
    try {
      var cRule = readOnlyList[x];
      if (cRule.domain === rule.domain && cRule.name === rule.name && cRule.path === rule.path) {
        added = false;
        readOnlyList.splice(x, 1);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
  if (added) {
    readOnlyList[readOnlyList.length] = rule;
  }
  data.readOnly = readOnlyList;
  return !!added;
}

export function deleteReadOnlyRule(data, toDelete) {
  const readOnlyList = data.readOnly;
  readOnlyList.splice(toDelete, 1);
  data.readOnly = readOnlyList;
}

export function deleteBlockRule(data, toDelete) {
  const filtersList = data.filters;
  filtersList.splice(toDelete, 1);
  data.filters = filtersList;
}

export function _getMessage(string, args) {
  return chrome.i18n.getMessage('editThis_' + string, args);
}

export function filterMatchesCookie(rule, name, domain, value) {
  var ruleDomainReg = new RegExp(rule.domain);
  var ruleNameReg = new RegExp(rule.name);
  var ruleValueReg = new RegExp(rule.value);
  if (rule.domain !== undefined && domain.match(ruleDomainReg) === null) {
    return false;
  }
  if (rule.name !== undefined && name.match(ruleNameReg) === null) {
    return false;
  }
  if (rule.value !== undefined && value.match(ruleValueReg) === null) {
    return false;
  }
  return true;
}

export function getUrlVars() {
  var d = [],
    c;
  var a = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var b = 0; b < a.length; b++) {
    c = a[b].split('=');
    d.push(c[0]);
    d[c[0]] = c[1];
  }
  return d;
}

export function copyToClipboard(text) {
  if (text === undefined) return;

  var scrollsave = $('body').scrollTop();

  var copyDiv = document.createElement('textarea');
  copyDiv.style.height = '0.5px';
  document.body.appendChild(copyDiv, document.body.firstChild);
  $(copyDiv).text(text);
  copyDiv.focus();
  copyDiv.select();
  document.execCommand('copy');
  document.body.removeChild(copyDiv);

  $('body').scrollTop(scrollsave);
}

export function setLoaderVisible(visible) {
  if (visible) {
    $('#loader-container').show();
  } else {
    $('#loader-container').hide();
  }
}
