/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Block List
=====================================================================*/
var blockList = {
  view: "list",
  id: "blockList",
  width: 240,
  height: 280,
  select: true,
  template: "#display#"
};

/*=====================================================================
Block List Controller
=====================================================================*/
var blockListCtlr = {
  list: null,

  init: function() {
    this.list = $$("blockList");
  },

  clear: function() {
    this.list.clearAll();
  },

  add: function(low, high, oddEven) {
    var precinct_id = precinctListCtlr.getSelected().id;
    var street = streetListCtlr.getSelected();
    var str = street.street_name + " " + street.street_type;
    var display = str;
    if (low) {
      display += ": " + low + "-" + high;
    }
    display += " (" + oddEven + ")";
    var item = {
      precinct_id: precinct_id,
      street_name: street.street_name,
      street_type: street.street_type,
      low_addr: low,
      high_addr: high,
      odd_even: oddEven,
      str: str,
      display: display
    };
    this.list.add(item);
  },

  remove: function() {
    this.list.remove(this.list.getSelectedId());
  },

  getSelected: function() {
    return getWebixList(this.list);
  }

};

/*=====================================================================
Block List Toolbar
=====================================================================*/
var blockListToolbar = {
  view: "toolbar",
  id: "blockListToolbar",
  height: 140,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Blocks"
        },
        {
          view: "button",
          label: "Clear",
          click: function() {
            blockListToolbarCtlr.clear();
          }
        },
        {
          view: "button",
          label: "Import",
          id: "apiImportBtn"
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          id: "lowAddr",
          label: "Low",
          labelWidth: 40,
          width: 120
        },
        {
          view: "text",
          id: "hiAddr",
          label: "High",
          labelWidth: 40,
          width: 120
        }
      ]
    },
    {
      cols: [
        {
          view: "radio",
          id: "oddEven",
          css: "toolbarRadio",
          options: [
            "O", "E", "B"
          ],
          value: "B"
        }
      ]
    },
    {
      cols: [
        {
          view: "button",
          label: "Add",
          click: function() {
            var low = $$("lowAddr").getValue();
            var high = $$("hiAddr").getValue();
            var oddEven = $$("oddEven").getValue();
            blockListCtlr.add(low, high, oddEven);
          }
        },
        {
          view: "button",
          label: "Remove",
          click: function() {
            blockListCtlr.remove("", "", "");
          }
        }
      ]
    }
  ]
};

/*=====================================================================
Block List Toolbar Controller
=====================================================================*/
var blockListToolbarCtlr = {
  toolbar: null,
  list: null,

  init: function() {
    this.toolbar = $$("blockListToolbar");
    this.list = $$("blockList");
  },

  clear: function() {
    $$("lowAddr").setValue("");
    $$("hiAddr").setValue("");
    $$("oddEven").setValue("B");
    blockListCtlr.clear();
  }

};

/*=====================================================================
Block Panel
=====================================================================*/
var blockPanel = {
  rows: [blockListToolbar, blockList]
};

/*=====================================================================
Block Panel Controller
=====================================================================*/
var blockPanelCtlr = {
  init: function() {
    blockListToolbarCtlr.init();
    blockListCtlr.init();
  }
};
