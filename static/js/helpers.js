/**
 * Created by Joe on 3/13/2017.
 */

function add2list(list_name, sort_fld, obj) {
  //$$(list_name).data.push(obj);
  var list_id = $$(list_name).add(obj);
  $$(list_name).data.sort(sort_fld, "asc");
  $$(list_name).refresh();
  $$(list_name).select(list_id);
}

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  return d.toString();
}

function toSQLDate(d) {
  return d.getFullYear().toString() + "-" +
    twoDigits(d.getMonth() + 1) + "-" +
    twoDigits(d.getDate());
}

function toSQLDateTime(d, t) {
  return toSQLDate(d) + " " +
      twoDigits(t.getHours()) + ":" +
      twoDigits(t.getMinutes());
}

function phone_prettify(phone) {
  if (!phone) return "";
  if (phone.match(/^\(\d{3}\)\d{3}-\d{4}$/)) return phone;
  return "(" + phone.substr(0,3) + ")" + phone.substr(3,3) + "-" + phone.substr(6);
}

function phone_uglify(phone) {
  return phone.replace(/\D/g, '');
}

function isPhone(value) {
  value = phone_uglify(value);
  return value == "" || value.match(/^\d{10}$/);
}

function isZip(value) {
  return value == "" || value.match(/^\d{5}$/);
}

function isEmail(value) {
  return value == "" || value.match(/(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})/);
}

function sortByName(a, b) {
  if (a.last_name == b.last_name) {
    if (a.first_name == b.first_name) {
      return (a.middle_name > b.middle_name) ? 1 : -1;
    } else {
      return (a.first_name > b.first_name) ? 1 : -1;
    }
  } else {
    return (a.last_name > b.last_name) ? 1 : -1;
  }
}

function ajaxAsyncGet(url, params) {
  webix.ajax(url, params).
    then(function(result) {
      return result.json();
  }).
    fail(function(xhr) {
      var response = JSON.parse(xhr.response);
      throw resonse.error.message;
  });
}

function ajaxAsyncPost(url, params) {
  webix.ajax().post(url, params).
    then(function(result) {
      return result.json();
  }).
    fail(function(xhr) {
      var response = JSON.parse(xhr.response);
      webix.message({type: "error", text: response.error.message});
  });
}

function ajaxSyncGet(url, params, result) {
  webix.ajax().sync().get(url, params, {
    error: function (text, data, XmlHttpRequest) {
      msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
      webix.message({type: "error", text: msg});
      result = null;
    },
    success: function (text, data, XmlHttpRequest) {
      result = data.json();
    }
  });
}

function wholeName(d) {
  var result = d["last_name"] + ", " + d["first_name"];
  if (d["middle_name"]) result += " " + d["middle_name"];
  if (d["name_suffix"]) result += ", " + d["name_suffix"];
  return result;
}

function wholeAddress(d) {
  var result = d["house_number"];
  if (d["pre_direction"]) result +=  " " + d["pre_direction"];
  result += " " + d["street_name"] +" " + d["street_type"];
  if (d["suf_direction"]) result += " " + d["suf_direction"];
  if (d["unit"]) result += " " + d["unit"];
  return result;
}

var redLocationFields = [
  "jurisdiction", "ward", "precinct", "city", "county", "zip"
];

var pinkLocationFields = [
  "voter_id", "state_house", "state_senate", "congress"
];

function missingLocationData(rec) {
  var result = [];
  for (var i=0; i<redLocationFields.length; i++) {
    if (!rec.hasOwnProperty(redLocationFields[i]) || rec[redLocationFields[i]] == "") {
      result.push(redLocationFields[i]);
    }
  }
  if (result) {
    return result;
  }
}

function sortAddress(a, b) {
  if (a.street_name == b.street_name) {
    if (a.street_type == b.street_type) {
      if (a.pre_direction == b.pre_direction) {
        if (a.suf_direction == b.suf_direction) {
          if (a.house_number == b.house_number) {
            return unit_sort(a.unit, b.unit);
          } else {
            return (a.house_number > b.house_number) ? 1 : -1;
          }
        } else {
          return (a.suf_direction > b.suf_direction) ? 1 : -1;
        }
      } else {
        return (a.pre_direction > b.pre_direction) ? 1 : -1;
      }
    } else {
      return (a.street_type > b.street_type) ? 1 : -1;
    }
  } else {
    return (a.street_name > b.street_name) ? 1 : -1;
  }
}

function unit_sort(u1, u2) {
  var nbr1 = "";
  if (u1 !== undefined) nbr1 = u1.match(/\d+/g);
  var nbr2 = "";
  if (u2 !== undefined) nbr2 = u2.match(/\d+/g);
  if (nbr1 == "" || nbr2 == "")
    return (u1 > u2) ? 1 : -1;
  return (parseInt(nbr1) > parseInt(nbr2)) ? 1 : -1;
}

function exportGrid(grid) {
  var filename = prompt("Enter a filename", "Data");
  if (filename === null) {
    return;
  }

  webix.csv.delimiter.rows = "\n";
  webix.csv.delimiter.cols = ",";
  webix.toCSV(grid, {
    ignore: {"id": true},
    filename: filename
  });
}

function getWebixList(list) {
  var items = [];
  for (var i=0; i<list.count(); i++) {
    items.push(list.getItem(list.getIdByIndex(i)));
  }
  return items;
}

function startswith(str, target) {
  return str.substring(0, target.length).toLowerCase() == target.toLowerCase();
}
