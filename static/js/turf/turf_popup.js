/**
 * Created by Joe on 8/19/2018.
 */

/*=====================================================================
Turf Popup
=====================================================================*/
var turfPopup = {
  view: "window",
  id: "turfPopup",
  modal: true,
  move: true,
  autowidth: true,
  position: "center",
  head: {
    view: "toolbar",
    cols: [
      {view: "label", label: "Neighborhood"},
      {},
      {
        view: "button",
        label: "Cancel",
        click: function() {
          turfPopupCtlr.hide();
        }
      },
      {
        view: "button",
        label: "Submit",
        click: function() {
          turfPopupCtlr.submit();
        }
      }
    ]

  },
  body: {
    rows: [ turfPanel ]
  }
};

/*=====================================================================
Turf Popup Controller
=====================================================================*/
var turfPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("turfPopup");
    this.hide();
    turfPanelCtlr.init();
  },

  show: function(juris_code, ward, pct, pct_id) {
    streetListCtlr.load(juris_code, ward, pct, pct_id);
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  },

  submit: function() {
    blocks = turfPanelCtlr.getSelections();
    $$("nbhNameBox").setValue(blocks[0].street_name + ", etc.");
    this.hide();
  }
};
