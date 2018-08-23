/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Street List
=====================================================================*/
var streetList = {
  view: "list",
  id: "streetList",
  width: 200,
  height: 400,
  select: true,
  template: "#street_name# #street_type#",
  on: {
    onSelectChange: function() {
      blockListToolbarCtlr.reset();
    }
  }
};

/*=====================================================================
Street List Controller
=====================================================================*/
var streetListCtlr = {
  list: null,
  pct_id: null,

  init: function() {
    this.list = $$("streetList");
  },

  clear: function() {
    $$("streetList").clearAll();
  },

  load: function(jurisdiction_code, ward, precinct, pct_id) {
    this.clear();
    blockListCtlr.clear();

    this.pct_id = pct_id;

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("trf.get_streets", {
      jurisdiction_code: jurisdiction_code,
      ward: ward,
      precinct: precinct
    });

    ajaxDao.get(url, function(data) {
      $$("streetList").parse(data["streets"]);
    });

  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.street_name.toLowerCase().indexOf(value) == 0;
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  }
};

/*=====================================================================
Street List Toolbar
=====================================================================*/
var streetListToolbar = {
  view: "toolbar",
  id: "streetListToolbar",
  height: 35,
  elements: [
    {
      view: "text",
      id: "streetFilter",
      label: "Street",
      on: {
        onTimedKeyPress: function() {
          streetListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Street List Toolbar Controller
=====================================================================*/
var streetListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("streetListToolbar");
  }
};

/*=====================================================================
Street Panel
=====================================================================*/
var streetPanel = {
  rows: [streetListToolbar, streetList]
};

/*=====================================================================
Street Panel Controller
=====================================================================*/
var streetPanelCtlr = {
  init: function() {
    streetListToolbarCtlr.init();
    streetListCtlr.init();
  },

  clear: function() {
    streetListCtlr.clear();
  },

  load: function(jurisCode, ward, pct) {
    streetListCtlr.load(jurisCode, ward, pct);
  }
};
