
// module.exports = todayDate;
//dont forget the s in exports
//we dont want the whole module to be associated with one function
//so we can create instances of the object within the module.

//module.exports.retDate = todayDate();
//we are initialising.retDate instance and setting it to todayDay function


//instead of assigning .retDate instance to a function called todayDate()
//we can create an anonymous function
//because we are not calling the function name directly
//and we are only using the instance to call the function.


exports.retDate = function(){
  const today = new Date();
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);
};

exports.retDay = function (){
  const today = new Date();
  const options = {
    day: "numeric",
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);
};
