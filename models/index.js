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
  },
  hooks: {
    beforeValidate: (page) => {
    function generateUrlTitle (title) {
      if (title) {
        // Removes all non-alphanumeric characters from title
        // And make whitespace underscore
        return title.replace(/\s+/g, '_').replace(/\W/g, '');
      } else {
        // Generates random 5 letter string
        return Math.random().toString(36).substring(2, 7);
      }
    }
      page.urlTitle = generateUrlTitle(page.title);
    },
  }
}
);

module.exports = {
  User: User,
  Page: Page,
  db: db
};
