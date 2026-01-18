export const evaluateQuestion = (correctquestions, selectedquestions,)=>{
    let result = 0 
    let maxpoint = 0
    let map = {}

    for(let correctquestion of correctquestions){
        map[correctquestion.questionId._id] = correctquestion
        maxpoint += correctquestion.questionId.point
    }

    for(let selectedquestion of selectedquestions){
        
        const found = map[selectedquestion.questionId]

        if(found){
            result += +evaluateAnswers(found,selectedquestion.answerIds)
        }
    }
    return Number(result/maxpoint).toFixed(2)*100
}   

const evaluateAnswers = (correct, selectedAnswers)=>{
    let correctAnswers = correct.answerIds
    const countCorrect = correctAnswers.length 
    let countSelect = 0
    for(let selectedAnswer of selectedAnswers ){
        if(correctAnswers.find(elm => elm == selectedAnswer)){
            countSelect+= correct.questionId.point 
        }
    }

    return Number(countSelect/countCorrect).toFixed(2)
}
