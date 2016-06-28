/* eslint-disable comma-style, curly */
const MySQLDialect = require('sql-query/lib/Dialects/mysql')

// Hacking to support AS400, which doesn't like backticks
MySQLDialect.escapeId = function escapeId () {
  return Array.prototype.slice.apply(arguments).map(function (el) {
    if (typeof el === 'object') {
      return el.str.replace(/\?:(id|value)/g, function (m) {
        if (m === '?:id') {
          return MySQLDialect.escapeId(el.escapes.shift());
        }
        // ?:value
        return MySQLDialect.escapeVal(el.escapes.shift());
      });
    }

    return el;
  }).join('.');
};

const SQLQuery = require('sql-query').Query

const query = new SQLQuery({
  timezone : 'local'
})

function createSelectQuery (table, columns) {
  var qs = query.select().from(table)

  if (Array.isArray(columns)) {
    qs = qs.select(columns)
  }

  return qs.build()
}

function createInsertQuery (table, data) {
  return query.insert()
      .into(table)
      .set(data)
      .build()
}

function createUpdateQuery (table, changes, conditions) {
  return query.update()
      .into(table)
      .set(changes)
      .where(conditions)
      .build()
}

function createDeleteQuery (table, conditions) {
  return query.remove()
      .from(table)
      .where(conditions)
      .build()
}

module.exports = {
  createSelectQuery : createSelectQuery,
  createDeleteQuery : createDeleteQuery,
  createInsertQuery : createInsertQuery,
  createUpdateQuery : createUpdateQuery
}
