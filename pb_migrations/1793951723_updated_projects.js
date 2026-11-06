/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2203071480",
    "maxSelect": 1,
    "name": "genre",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "Audiovisuel",
      "Graphisme",
      "Developpement Web"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2203071480",
    "maxSelect": 1,
    "name": "genre",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "Audiovisuel",
      "Graphisme",
      "Communication"
    ]
  }))

  return app.save(collection)
})
