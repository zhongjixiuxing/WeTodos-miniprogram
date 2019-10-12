const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const uuid = () => {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
}

/***
 * 将时间格式化为Number 返回
 *
 * @param date
 * @returns {number}
 */
const getDateNo = (date) => {
  if (!date) {
    date = new Date();
  }

  const month = (date.getUTCMonth() + 1) < 10 ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1);
  const day = (date.getDate() + 1) < 10 ? '0' + (date.getDate() + 1) : (date.getDate() + 1);
  return parseInt(`${date.getFullYear()}${month}${day}`)
}

const jsonToQueryString = (json = {}) => {
  const attrs = Object.keys(json);
  let query = '';
  for (let i = 0; i < attrs.length; i += 1) {
    const key = attrs[i];
    let attrVal = json[key];
    let head = '&';
    if (i === 0) {
      head = '?';
    }
    if (Array.isArray(attrVal)) {
      let arrValue = '';
      for (let k = 0; k < attrVal.length; k += 1) {
        if (k === 0) {
          arrValue = attrVal[k];
        } else {
          arrValue = `${arrValue},${attrVal[k]}`;
        }
      }
      attrVal = arrValue;
    }
    query = `${query}${head}${key}=${attrVal}`;
  }
  return query;
}

const getCurrentRouteUrl = (pages, opts = {}) => {
  let currPage = null;
  if (pages.length) {
    currPage = pages[pages.length - 1];
    const options = {...currPage.options, ...opts};

    const url = `/${currPage.route}${jsonToQueryString(options)}`;
    return url;
  }

  return null;
}

/**
 * 填充一些task默认属性
 *
 */
const fillNewTaskObj = (task) => {
  if (!task.state) {
    task.state = 'pending';
  }

  if (!task.important) {
    task.important = false;
  }

  if (!task.steps) {
    task.steps = [];
  }

  if (!task.hasOwnProperty('expireDay')) {
    task.expireDay = 0;
  }

  if (!task.hasOwnProperty('isMyday')) {
    task.isMyday = false;
  }

  if (!task.hasOwnProperty('comment')) {
    task.comment = '';
  }

  if (!task.hasOwnProperty('createdAt')) {
    task.createdAt = new Date().toISOString();
  }

  if (!task.hasOwnProperty('updatedAt')) {
    task.updatedAt = new Date().toISOString();
  }

  return task;
}


module.exports = {
  formatTime: formatTime,
  uuid,
  getCurrentRouteUrl,
  fillNewTaskObj,
  getDateNo
}
