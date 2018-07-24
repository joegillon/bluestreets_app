/**
 * Created by Joe on 7/22/2018.
 */

/*=====================================================================
Save Popup
=====================================================================*/
var instructions = "Data is automatically saved to your local DB. " +
    "To save to a CSV file as well, use the file selector below.";

var savePopup = {
  view: "window",
  id: "savePopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  width: 300,
  height: 300,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Save My Data"
      },
      {
        view: "button",
        value: "Cancel",
        click: "savePopupCtlr.hide();"
      }
    ]
  },
  body: {
    rows: [
      {
        view: "template",
        template: instructions
      },
      {
        view: "template",
        template: '<input id="fileUpload" name="files[]" type="file" ' +
        'onchange="savePopupCtlr.fileSelect(this.files)">'
      },
      {
        view: "button",
        value: "Save",
        click: function() {
          savePopupCtlr.save();
        }
      }
    ]
  }
};

/*=====================================================================
Save Popup Controller
=====================================================================*/
var savePopupCtlr = {
  popup: null,
  filename: null,

  init: function() {
    this.popup = $$("savePopup");
    this.popup.hide();
  },

  show: function() {
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  },

  fileSelect: function(files) {
    this.filename = files[0].name;
  },

  save: function() {
    // save to db
    if (this.filename !== null) {
      // save to csv
      alert(data_path + this.filename);
    }
    this.popup.hide();
  }
};
