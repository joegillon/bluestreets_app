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
      {view: "label", label: "Define Neighborhood"},
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

  show: function() {
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }
};
