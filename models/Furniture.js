'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var furnitureSchema = Schema( {
  Type:String,
  Width: Number,
  Length: Number,
  picAddress:String,
} );

module.exports = mongoose.model( 'furniture', furnitureSchema )
