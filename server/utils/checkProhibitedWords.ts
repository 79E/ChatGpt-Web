function checkProhibitedWords(text: string, words: string) {
	const wordList = words.split(',');
	const wordRegex = new RegExp(wordList.join('|'), 'g');
	const matchedWords: Array<string> = [];
	const action = wordRegex.test(text) ? 'block' : 'pass';
	text = text.replace(wordRegex, function(match) {
		matchedWords.push(match);
	  return '*'.repeat(match.length);
	});
	return { action, text, matchedWords };
}

export default checkProhibitedWords;
