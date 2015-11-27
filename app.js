var QuizApp = angular.module('QuizApp',['ngAnimate']);
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var COLORS = ['#F44336','#8BC34A','#FFC107', '#9E9E9E', '#00BCD4', '#B79183'];
QuizApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

QuizApp.controller('QuestionBlockController', ['$scope', '$rootScope', '$compile', function($scope, $rootScope, $compile) {
	$scope.statustext = "Quiz Started";
	$scope.quiz = [];
	$scope.activeQuestion = -1;
	$scope.ifQuizEnded = false;
	$scope.ifQuizInitialized = false;
	$scope.ifQuizStarted = false;
	$scope.quizjson = [];
	var height = (window.innerHeight - 180) + 'px';
	angular.element('.question-block-full').css('height', height);
	$scope.startQuiz = function(){
		$scope.quizjson = $rootScope.quizjson;
		$scope.ifQuizInitialized = $rootScope.ifQuizInitialized;
		$scope.makeQuiz();
		$scope.ifQuizStarted = true;
		$scope.ifQuizEnded = false;
		$compile(angular.element(".quiz-name"));
		$scope.nextQuestion();
	}
	$scope.makeQuiz = function(){
		for (var i = 0; i < $scope.quizjson.length; i++) {
			var jsonq = $scope.quizjson[i];
			var q = new Object();
			q = {
				arrayindex: i,
				question: jsonq.question,
				options: [{
					label: 'A',
					text: jsonq.opta,
				},{
					label: 'B',
					text: jsonq.optb,
				},{
					label: 'C',
					text: jsonq.optc,
				},{
					label: 'D',
					text: jsonq.optd,
				}],
				correctans: jsonq.correctans
			}
			$scope.quiz.push(q);
			$scope.resetQuestion(i);
			$scope.setBgColor();
		};
	}
	$scope.setBgColor = function(){
		$scope.quiz[0].bgColor = '#fff';
		for (var i = 1; i < $scope.quiz.length; i++) {
			$scope.quiz[i].bgColor = COLORS[getRandomInt(0,COLORS.length)];
		};
	}
	$scope.setOptionState = function(arrayindex, optionlabel, state){
		for (var i = 0; i < $scope.quiz[arrayindex].options.length; i++) {
			if($scope.quiz[arrayindex].options[i].label == optionlabel){
				$scope.quiz[arrayindex].options[i].state = state;
			}
		};
	}
	$scope.checkIfCorrect = function(arrayindex, option){
		var q = $scope.quiz[arrayindex];
		if(option.label == q.correctans){
			$scope.setOptionState(arrayindex, option.label, 'correct');
		}else{
			$scope.setOptionState(arrayindex, option.label, 'incorrect');
		}
	}
	$scope.resetQuestion = function(arrayindex){
		var i = arrayindex;
		$scope.setOptionState(i, 'A', 'unanswered');
		$scope.setOptionState(i, 'B', 'unanswered');
		$scope.setOptionState(i, 'C', 'unanswered');
		$scope.setOptionState(i, 'D', 'unanswered');
	}
	$scope.showCorrectAns = function(arrayindex){
		$scope.setOptionState(arrayindex, $scope.quiz[arrayindex].correctans, 'correct');
	}
	$scope.endQuiz = function(){
		$scope.ifQuizEnded = true;
	}
	$scope.previousQuestion = function(){
		if($scope.activeQuestion > 0){
			$scope.activeQuestion--;
		}else{
			alert('No more questions');
		}
		var classSelector = '#questionBlockFull'+$scope.activeQuestion;
		angular.element(classSelector).css('background-color', $scope.quiz[$scope.activeQuestion].bgColor);
	}
	$scope.nextQuestion = function(){
		if($scope.activeQuestion < $scope.quiz.length-1){
			$scope.activeQuestion++;
		}else{
			$scope.ifQuizStarted = false;
			$scope.endQuiz();
			$rootScope.$broadcast('END_QUIZ');
		}
		var height = (window.innerHeight - 180) + 'px';
		var classSelector = '#questionBlockFull'+$scope.activeQuestion;
		angular.element(classSelector).css('height', height);
		// console.log(COLORS[$scope.quiz[$scope.activeQuestion].bgColor);
		angular.element(classSelector).css('background-color', $scope.quiz[$scope.activeQuestion].bgColor);
	}
	$scope.$on('START_QUIZ', $scope.startQuiz);
}])
QuizApp.controller('QuizController', ['$scope', '$rootScope', '$compile', function($scope, $rootScope, $compile) {
	$scope.ifQuizEnded = false;
	$scope.quizname = 'Quiz';
 	$scope.kvquiz = {
 		name : '',
 		showans: false
 	};
    $scope.SetQuizName = function(){
    	$scope.quizname = $scope.kvquiz.name;
    	$compile(angular.element('#quizName'));
    }
    $scope.getQuizName = function(){
    	return $scope.quizname;
    }
	$rootScope.ifQuizInitialized = false;
	$rootScope.quizjson = [];
	$scope.selectedQuestions = [];
	$scope.quizjson = [{"number":1,"question":"Who wrote the famous book - 'We the people'?","opta":"T.N.Kaul","optb":"J.R.D. Tata","optc":"Khushwant Singh","optd":"Nani Palkhivala","correctans":"D"},
{"number":2,"question":"Who is the author of the book 'Nineteen Eighty Four'?","opta":"Thomas Hardy","optb":"Emile Zola","optc":"George Orwell","optd":"Walter Scott","correctans":"C"},
{"number":3,"question":"Which of the following is NOT written by Munshi Premchand?","opta":"Gaban","optb":"Godan","optc":"Guide","optd":"Manasorovar","correctans":"C"},
{"number":4,"question":"Who is the author of the book 'Forbidden Verses'?","opta":"Salman RushDie","optb":"Abu Nuwas","optc":"Ms. Taslima Nasrin","optd":"D.H. Lawrence","correctans":"B"},
{"number":5,"question":"The lead character in the film 'The Bandit Queen' has been played by","opta":"Rupa Ganguly","optb":"Seema Biswas","optc":"Pratiba Sinha","optd":"Shabama Azmi","correctans":"B"},
{"number":6,"question":"Which of the following books has been written by Vikram Seth?","opta":"My God Died Young","optb":"Islamic Bomb","optc":"Look Back in Anger","optd":"A Suitable Boy","correctans":"D"},
{"number":7,"question":"Who wrote the line: ' A thing of beauty is a joy forever'?","opta":"John Keats","optb":"Robert Browing","optc":"P.B.Shelley","optd":"William Wordsworth","correctans":"A"},
{"number":8,"question":"Who has written the book 'My Frozen Turbulence in Kashmir'?","opta":"Anees Jung","optb":"Jagmohan","optc":"M.J.Akbar","optd":"Nissim Ezekiel","correctans":"B"},
{"number":9,"question":"The book 'To Live or Not Live' was written by","opta":"V.S. Naipaul","optb":"Alexandra Dumas","optc":"George Elliot","optd":"Nirad C. Chaudhuri","correctans":"D"},
{"number":10,"question":"In India the first television programme was broadcasted in","opta":"1959","optb":"1965","optc":"1976","optd":"1957","correctans":"A"},
{"number":11,"question":"'A Voice for Freedom' is a book written by","opta":"Corazon Aquino","optb":"Nayantara Sahgal","optc":"Aung San Suu Kyi","optd":"Benazir Bhutto","correctans":"B"},
{"number":12,"question":"Who is the father of English Poetry?","opta":"Milton","optb":"Wordsworth","optc":"Chaucer","optd":"Charles Dickens","correctans":"C"}]
	$scope.toggleSelect = function(number){
		var index = number - 1;
		var found = false;
		for (var i = 0; i < $scope.selectedQuestions.length; i++) {
			if($scope.selectedQuestions[i] == index){
				$scope.selectedQuestions.splice(i,1);
				found = true;
			}
		};
		if(!found){
			$scope.selectedQuestions.push(index);
		}
		$scope.setColorForSelected();
	}
	$scope.setColorForSelected = function(){
		for (var i = 0; i < $scope.quizjson.length; i++) {
			if($scope.selectedQuestions.indexOf(i) != -1){
				$scope.quizjson[i].selected = true;
			}else{
				$scope.quizjson[i].selected = false;	
			}
		};
	}
	$scope.startQuiz = function(){
		if($scope.selectedQuestions.length == 0){
			alert('Please select questions first!');
		}else{
			$rootScope.ifQuizInitialized = true;
			$scope.ifQuizInitialized = true;
			for (var i = 0; i < $scope.selectedQuestions.length; i++) {
				var index = $scope.selectedQuestions[i];
				var q = $scope.quizjson[index];
				delete q.selected;
				$rootScope.quizjson.push(q);
			};
			$rootScope.$broadcast('START_QUIZ');
		}
	}
	$scope.endQuiz = function(){
		$scope.ifQuizEnded = true;
	}
	$scope.restartQuiz = function(){
		window.location.reload();
	}
	$scope.$on('END_QUIZ', $scope.endQuiz);
	$scope.setColorForSelected();
}])