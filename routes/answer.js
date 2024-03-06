const express = require('express');
const { Answer } = require('../models');// index는 파일 이름 생략 가능 
const { Op } = require("sequelize");
const session = require('express-session');
const crypto = require('crypto');

const router = express.Router();

//답변 작성 api
router.post('/', async (req, res) => {
    try {
        const answer = await Answer.create(req.body); // 요청의 내용으로 새로운 답변 생성
        if (answer) {
            return res.status(200).json({ "message": "답변이 성공적으로 등록되었습니다." });
        } else {
            return res.status(400).json({ "message": "답변 등록에 실패했습니다." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "서버 오류로 답변 등록에 실패했습니다." });
    }
})


//답변 수정 api 
router.patch('/:answer_id',async(req,res)=>{
const {isAccepted,isLiked}=req.body
const id=req.params.answer_id
try{
    const answer=await Answer.update({
        isAccepted:isAccepted,
        isLiked:isLiked
    },{
        where:{id:id}
    })
    const editedAnswer=await Answer.findOne({
        where :{id:id}
    })
    console.log("***",editedAnswer.dataValues)
    if(answer){
        return res.status(201).json({"message":"답변 수정이 정상적으로 되었습니다."})
    }else{
        return res.status(404).json({"message":"답변 수정이 정상적으로 실패하였습니다."})
    }
}catch(error){
    console.log(error);
    return res.status(500).json({"message":"답변 수정이 정상적으로 실패하였습니다."})
    //console.log(error);
}
})

// 답변 삭제 API
router.delete('/:answer_id', async (req, res) => {
    const id = req.params.answer_id;
    try {
        Answer.destroy({
            where: { id: id }
        });
        return res.status(201).json({ "message": "답변이 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "답변 삭제에 실패했습니다." });
    }
});

//답변 조회 api
router.get('/',async(req,res)=>{
    try{
        const answers=await Answer.findAll();
        if(answers){
            return res.status(200).json({"message":"답변들을 정상적으로 모두 가져왔습니다"})
        }else{
            return res.status(400).json({"message":"답변들을 정상적으로 불러오는데에 실패했습니다."})
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({"message:":"답변들을 정상적으로 불러오는데에 실패했습니다."})
    }
})

//답변 불러오는 api
router.get('/:answer_id',async(req,res)=>{
    try{
    const answer_id=req.params.answer_id;
    const answer=await Answer.findOne({
    where:{id:answer_id}
    });
    if(answer){
        return res.status(200).json({'message':"답변을 모두 불러왔습니다."})
    }else{
        return res.status(400).json({'message':"답변을 모두 불러오는데 실패했습니다."})
    }
    }catch(error){
        console.log(error);
        return res.status(500).json({'message':'답변을 모두 불러오는데 실패했습니다.'})
    }
})

//답변채택 api
router.patch('/:answer_id/accept', async (req, res) => {
    const id = req.params.answer_id;
    try {
        const updatedAnswer = await Answer.update(
            { isAccepted: true },
            { where: { id: id } }
        );
        if (updatedAnswer[0] !== 0) {
            return res.status(200).json({ "message": "답변이 채택되었습니다." });
        } else {
            return res.status(404).json({ "message": "해당 답변을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "서버 오류로 인해 답변 채택에 실패했습니다." });
    }
});
module.exports = router