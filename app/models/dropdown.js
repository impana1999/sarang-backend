const mongoose =  require ('mongoose')
const Schema = mongoose.Schema;

const dropdownschema = new Schema({
religion:{
    type : Array,
    default:[]
},
community:{
    type :Array,
    default:[]
},
mother_tongue:{
    type :Array,
    default:[]
},
living_in_city:{
    type :Array,
    default:[]
},
living_in_state:{
    type :Array,
    default:[]
},
married_status:{
    type :Array,
    default:[]
},
diet:{
    type :Array,
    default:[]
},
height:{
    type :Array,
    default:[]
},
qualification:{
    type :Array,
    default:[]
},
worked_with:{
    type :Array,
    default:[]
},
income:{
    type :[Number],
    default:[]
},
physical_status:{
    type :Array,
    default:[]
},
eating_habbits:{
    type :Array,
    default:[]
},
educational:{
    type :Array,
    default:[]
},
employed_in:{
    type :Array,
    default:[]
},
occupation:{
    type :Array,
    default:[]
},
ancestrel_origin:{
    type :Array,
    default:[]
},
looking_for:{
    type :Array,
    default:[]
},
residential_status:{
    type :Array,
    default:[]
},
residential_area:{
    type :Array,
    default:[]
},
city:{
    type :Array,
    default:[]
},
caste:{
    type :Array,
    default:[]
},
drinking_habbits:{
    type :Array,
    default:[]
},
smoking_habbits:{
    type :Array,
    default:[]
},
createdAt:{
    type : Number,
    default:0
},
updatedAt:{
    type : Number,
    default:0
},
},{timestamps:false})

dropdownschema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }
    next();
});
module.exports=new mongoose.model('dropdown' ,dropdownschema)
 