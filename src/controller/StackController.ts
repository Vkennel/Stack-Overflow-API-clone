import express, {Request, Response, NextFunction } from 'express'
import questionSchema from "../model/QuestionModel"
import answerSchema from "../model/AnswerModel"
import commentSchema from "../model/CommentModel"

export async function Question(req: Request, res: Response, next: NextFunction) {
const questionData = new questionSchema({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags,
    user: req.body.user
})

await questionData.save().then((doc) => {
    res.status(201).send({
        status: true,
        data: doc
    })
}).catch(() => {
    res.status(400).send({
        status: false,
        message: "Error occured while adding question"
    })
})
}

export async function Answer(req: Request, res: Response, next: NextFunction) {
    const answerData = new answerSchema({
        question_id: req.body.question_id,
        answer: req.body.answer,
        user: req.body.user
    })
    
    await answerData.save().then((doc) => {
        res.status(201).send({
            status: true,
            data: doc
        })
    }).catch(() => {
        res.status(400).send({
            status: false,
            message: "Error occured while adding answer"
        })
    })
    }


    export async function Comment(req: Request, res: Response, next: NextFunction) {
        try{
            commentSchema.create({
                question_id: req.body.question_id,
                comment: req.body.comment,
                user: req.body.user

            }).then((doc) => {
                res.status(201).send({
                    status: true,
                    message: "Comment added successfully"
                })
            }).catch(() => {
                res.status(400).send({
                    status: false,
                    message: "Error occured while adding comment"
                })
            })
        }
        catch (err) {
            res.status(500).send({
                status: false,
                message: "Error while adding comments"
            })
        }
        
        }