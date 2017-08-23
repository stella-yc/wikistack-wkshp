var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack-wkshp', {
  logging: false
});

// User Model
const User = db.define('user', {
  // fields in model/table
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

// Page Model
const Page = db.define('page', {
  // fields in model/table
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    defaultValue: 'open'
  }
}, { // Model options
  getterMethods: {
    route() {
      return `/wiki/${this.urlTitle}`;
    }
  }
}
);

module.exports = {
  User: User,
  Page: Page,
  db: db
};
