/**
 * Created by Joe on 9/13/2018.
 */

/*======================================================================
Voter History Panel
======================================================================*/
var vtrHistoryPanel = {
  id: "vtrHistoryPanel",
  type: "wide",
  autowidth: true,
  cols: [nbhListPanel]
};

var vtrHistoryPanelCtlr = {
  init: function() {
    var myPanel = $$("vtrHistoryPanel");
    nbhListPanelCtlr.init(true);

    webix.extend(myPanel, webix.ProgressBar);
    $$("nbhButton").attachEvent("onItemClick", this.execute);
  },

  execute: function() {
    var myPanel = $$("vtrHistoryPanel");

    var nbh = nbhListCtlr.selection();
    myPanel.disable();
    myPanel.showProgress({
      delay: 1000,
      hide: false
    });

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("vtr.history");
    ajaxDao.post(url, nbh, function (response) {
      webix.delay(function () {
        if (response.error) {
          webix.message({type: "error", text: response.error})
        } else {
          myPanel.hideProgress();
          myPanel.enable();
          webix.message('Done!');
        }
      }, myPanel, null, 1000);
    });
  }
};
