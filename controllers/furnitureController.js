'use strict';
const Furniture = require( '../models/Furniture' );


exports.saveFurniture = ( req, res ) => {
  console.log("in saveFur!")
  console.dir(req.body)
  let newFurniture = new Furniture( {
    Type:req.body.Type,
    Width: req.body.Width,
    Length: req.body.Length,
    picAddress:req.body.picAddress
  } )

  //console.log("skill = "+newSkill)

  newFurniture.save()
    .then( () => {
      console.log("saving Fur")
      res.redirect( '/postresult' );
    } )
    .catch( error => {
      res.send( error );
    } ).
    then(() => { console.log("saved Fur")})
};


exports.getAllFurniture = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Furniture.find( )
    .exec()
    .then( ( furnitures ) => {
      res.render( 'furnitureStorage', {
        furnitures:furnitures,
        title:'furniture'
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

exports.getFurnitures = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Furniture.find().toArray((err, items)=>{
    .exec()
    .then( ( result ) => {
      console.log( req.body.type );
      res.render( 'furnitureSearch', {
            furnitures:result,
            title:'furnitures'
      } );
      console.log( "hey" );

    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
  };
};
