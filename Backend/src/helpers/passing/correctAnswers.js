export const correctAnswers = (questions)=>{ 
    const correctAnswers = [] 
    for (let question of questions){
        const obj = {}
        obj.questionId = question._id
        obj.answerIds = question.answers
            .filter(answer => answer.isCorrect== true)
            .map(answer => answer._id);
        
        correctAnswers.push(obj)

    }
    
    return correctAnswers
}