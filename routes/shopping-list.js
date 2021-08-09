const express = require("express");
const router = new express.Router();
const helperClass = require("./helper");


router.get('/', (req, res) => {

    let data = helperClass.processData.get_data();
    return res.json({data});

});

router.post('/', (req, res) => {

    const item = {

        name: req.body.name, 
        price: req.body.price,

    }

    let data = helperClass.processData.add_item(item);
    return res.status(201).json({data});

});

router.get('/:name',(req, res) => {

    let data = helperClass.processData.get_item(req.params.name);
    return res.json({data});

});

router.patch('/:name', (req, res) => {

    let data = helperClass.processData.update_item(req.params.name, req.body);
    return res.json({data});

});

router.delete('/:name', (req, res) => {

    helperClass.processData.delete_item(req.params.name);
    return res.json({"message":"Deleted"});

});


module.exports = router;