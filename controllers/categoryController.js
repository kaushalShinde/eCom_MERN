
import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

export const createCategoryController = async (req, res) => {
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message: 'Insefficient Detains'});
        }

        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: 'Category Already Exist',
            })
        }

        const category = await categoryModel.create({name, slug:slugify(name)});
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Category',
            error,            
        })
    };  
}; 



export const updateCategoyController = async (req, res) => {
    try{
        const { name } = req.body;
        const { id } = req.params;

        if(!name){
            return 
        }

        console.log(req.params);
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true});

        res.status(200).send({
            success: true,
            message: 'Category Updated SUccessfully',
            category,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updating Category',
            error,            
        })

    };
};


export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'Got All Categories ',
            category,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting All Categories',
            error,            
        })
    };
};



export const singleCategoryController = async (req, res) => {
    try{
        const { slug } = req.params;

        const category = await categoryModel.findOne({slug: slug});
        res.status(200).send({
            success: true,
            message: 'Got Single Category',
            category,
        })
    }
    catch (error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Single Categorie',
            error,            
        })
    };
};


export const deleteCategoryController = async (req, res) => {
    try{
        const { id } = req.params;

        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category Deleted',
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Deleting Category',
            error,            
        })
    }
}