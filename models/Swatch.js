'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var swatchSchema = Schema( {
  BrandName:String,
  TypeMakeup: String,
  ColorCode: String,
  userComments:String,

} );

module.exports = mongoose.model( 'swatch', swatchSchema )
