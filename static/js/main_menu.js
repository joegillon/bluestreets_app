/**
* Created by Joe on 6/10/2017.
*/

var skins = [
  "Aircompact", "Antique", "Brownie", "Clouds", "Compact", "Dusty",
  "Eggplant", "Flamingo", "Flat", "Forest", "Light", "Mauve", "Metro", "Monkey",
  "Pinko", "QED", "Saints", "Sandy", "Tan", "Tangerine"
];

var menu_data = [
  {
    id: "neighborhoods",
    icon: "map",
    value: "My Neighborhoods"
  },
  {
    id: "voter_lists",
    icon: "users",
    value: "Voters",
    submenu: [
      {id: "vtr_import_api", value: "Import from API"},
      {id: "vtr_import_csv", value: "Import Spreadsheet"},
      {id: "vtr_worksheet", value: "Worksheet"},
      {id: "vtr_sync", value: "Synchronize"}
    ]
  },
  {
    id: "con_lists",
    icon: "address-card-o",
    value: "Contacts",
    submenu: [
      {id: "con_grid", value: "My Contacts"},
      {id: "con_import_api", value: "Import from API"},
      {id: "con_import_csv", value: "Import Spreadsheet"},
      {id: "con_entry", value: "Direct Entry"},
      {id: "con_crewboard", value: "Battle Stations"},
      {id: "con_sync", value: "Synchronize"}
    ]
  },
  {
    id: "groups",
    icon: "sitemap",
    value: "Groups"
  },
  {
    id: "cleaning",
    icon: "database",
    value: "Data Cleaning",
    submenu: [
      {id: "con_email_dups", value: "Email Duplicates"},
      {id: "con_phone_dups", value: "Phone Duplicates"},
      {id: "con_name_addr_dups", value: "Name + Address Duplicates"},
      {id: "con_name_dups", value: "Name Duplicates"},
      {id: "synchronize", value: "Sync with Voters"}
    ]
  },
  {
    id: "skins",
    icon: "",
    value: "Skins",
    submenu: skins
  }
];

var mainMenu = {
  view: "menu",
  id: "mainMenu",
  data: menu_data,
  type: {
    subsign: true,
    height: 50
  },
  on: {
    onMenuItemClick: function(id) {

      if (id == "neighborhoods") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('trf.neighborhoods');
        return;
      }
      if (id == "vtr_import_api") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('vtr.api_import');
        return;
      }
      if (id == "vtr_import_csv") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('vtr.csv_import');
        return;
      }
      if (id == "con_grid") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.grid");
        return;
      }
      if (id == "con_import_api") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.api_import");
        return;
      }
      if (id == "con_import_csv") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.csv_import");
        return;
      }
      if (id == "con_entry") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.entry");
        return;
      }
      if (id == "con_sync") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.sync");
        return;
      }
      if (id == "con_crewboard") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.crewboard");
        return;
      }
      if (id == "con_email_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.email_duplicates");
        return;
      }
      if (id == "con_phone_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.phone_duplicates");
        return;
      }
      if (id == "con_name_addr_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.name_addr_duplicates");
        return;
      }
      if (id == "con_name_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.name_duplicates");
        return;
      }
      if (id == "synchronize") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.voter_sync");
        return;
      }
      if (id == "groups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("grp.groups");
        return;
      }
      if (skins.indexOf(id) != -1) {
        switch_skin(id);
        return false;
      }
      webix.message("Not yet implemented");
    }
  }
};
