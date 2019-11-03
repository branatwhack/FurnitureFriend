'use strict';
const Swatch = require( '../models/Swatch' );


exports.saveSwatch = ( req, res ) => {
  console.log("in saveSwatch!")
  console.dir(req.body)
  let newSwatch = new Swatch( {
    BrandName:req.body.BrandName,
    TypeMakeup: req.body.TypeMakeup,
    ColorCode: req.body.ColorCode,
    userComments:req.body.userComments
  } )

  //console.log("skill = "+newSkill)

  newSwatch.save()
    .then( () => {
      console.log("saving swatch")
      res.redirect( '/postresult' );
    } )
    .catch( error => {
      res.send( error );
    } ).
    then(() => { console.log("saved swatch")})
};


exports.getAllSwatch = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Swatch.find( )
    .exec()
    .then( ( swatches ) => {
      res.render( 'swatchPlaza', {
        swatches:swatches,
        title:'swatch'
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

// this displays all of the skills
exports.getOneSwatch = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('********************   the id is '+id)
  Swatch.findOne({_id:id})
    .exec()
    .then( ( swatch ) => {
      res.render( 'swatch', {
        swatch:swatch, title:"swatch"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
