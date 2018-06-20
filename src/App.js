import React, { Component } from 'react';
import './index.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newText: ' ',
            allWords: [],
            femWordCount: 0,
            maleWordCount: 0
        };
        this.findBias = this.findBias.bind(this);
        this.placeCaretAtEnd = this.placeCaretAtEnd.bind(this);
        this.setText = this.setText.bind(this);
        this.colourSet = this.colourSet.bind(this);
        this.countMatchingWords = this.countMatchingWords.bind(this);
    }
    componentDidMount() {
        const endpoint = {
            feminineTargetedWords: ['our team', 'contribute', 'interpersonal', 'caring', 'encourage', 'family', 'families', 'helpful', 'sincere', 'interpersonal skills', 'meaningful', 'collaborative', 'empathy', 'kindness', 'passion for making', 'balancing', 'take care of', 'supportive', 'a sincere', 'catalyst', 'be comfortable', 'affectionate', 'child', 'children', 'cheer', 'cheerful', 'commitment', 'commit', 'communal', 'compassion', 'compassionate', 'connection', 'connect', 'considerate', 'cooperative', 'cooperate', 'depend', 'emotional', , 'empathetic', 'empathy', 'feminine', 'flatterable', 'gentle', 'honest', 'interperonal', 'kindess', 'kinship', 'loyalty', 'loyal', 'modesty', 'nag', 'nuture', 'pleasant', 'polite', 'quiet', 'responsible', 'responsive', 'sensitive', 'submissive', 'support', 'sympathy', 'tender', 'together', 'trust', 'understand', 'warm', 'whine', 'yield'],
            maleTargetedWords: ['enforced', 'superior', 'phenomenal', 'unrivalled', 'tackle', 'drive', 'exceptional', 'experts', 'relationships managing command', 'manage', 'under pressure', 'proven', 'competitive', 'enforce', 'outstanding', 'extraordinary', 'manage relationships', 'managing', 'best in class', 'proven track record', 'command respect', 'strong track record', 'expert', 'aggressively', 'best-in-class', 'owning the', 'active', 'adventurous', 'aggressive', 'ambitious', 'analytical', 'assertive', 'athletic', 'autonomous', 'boastful', 'boast', 'challenging', 'challenge', 'competitive', 'confident', 'courageous', 'decide', 'decisive', 'decision', 'determine', 'dominant', 'dominace', 'forceful', 'force', 'greedy', 'headstrong', 'heierarchical', 'heierarchy', 'hostility', 'hostile', 'impulsive', 'independent', 'individual', 'intellectual', 'intellect', 'lead', 'logic', 'masculine', 'objective', 'opinion', 'outspoken', 'persist', 'principle', 'reckless', 'stubborn', 'superior', 'self-confident', 'self-sufficient', 'self-reliant'] 
        };
        const allWords = endpoint.maleTargetedWords.concat(endpoint.feminineTargetedWords);
        this.setState({endpoint, allWords});
    }
    findBias() {
        const words = document.getElementById('div').textContent;
        if(words === '') {
            this.setState({femWordCount: 0, maleWordCount: 0});
        }
        const allSetofWords = this.state.allWords;
        const regexp = new RegExp(`\\b(${allSetofWords.join('|')})\\b`, 'gi');
        const result = words.replace(regexp, (x) => {
            return '<span class=' + this.colourSet(x) + `>${x}</span>`;
        });
        this.setState({newText: result}, () => {
            this.setText();
        });
    }
    colourSet(match) {
        let femMatch = false;
        let maleMatch = false;
        if (this.state.endpoint.feminineTargetedWords.includes(match)) {
            femMatch = true;
            this.countMatchingWords(femMatch, maleMatch);
            return 'femWord';
        }
        if (this.state.endpoint.maleTargetedWords.includes(match)) {
            maleMatch = true;
            this.countMatchingWords(femMatch, maleMatch);
            return 'maleWord';
        }
        return 'border:none;';
    }
    setText() {
        if(this.state.newText !== null) {
            document.getElementById('div').innerHTML = this.state.newText;
            this.placeCaretAtEnd(document.getElementById('div'));
        }
        console.log('hellooooo')
    }
    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange !== 'undefined') {
            const textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }
    countMatchingWords(femMatch, maleMatch) {
        const text = this.state.newText;
        if(femMatch) {
            const femWords = this.state.endpoint.feminineTargetedWords;
            const femRegexp = new RegExp(`\\b(${femWords.join('|')})\\b`, 'gi');
            let femResult = text.match(femRegexp, 'gi');
            if(femResult !== null) {
                const femWordCount = femResult.length;
                this.setState({femWordCount});
            }
        }else if(maleMatch) {
            const maleWords = this.state.endpoint.maleTargetedWords;
            const maleRegexp = new RegExp(`\\b(${maleWords.join('|')})\\b`, 'gi');
            let maleResult = text.match(maleRegexp, 'gi');
            if(maleResult !== null) {
                const maleWordCount = maleResult.length;
                this.setState({maleWordCount});
            }
        }
    }
    render() {
        return (
            <div>
                <h1 className="headingTitle">Bias Highlighter</h1>
                <p className="taglin">Enter your job posting below to view any words that may be biased towards male or female applicants. Including biased words in your job positing will lead to less overall applicants. To ensure a less biased job posting, aim to have no words with implicit bias, or the equal amount of both female and male gendered words.</p>
                <div className="counterContainer">
                    <div className="femCounter">{this.state.femWordCount}</div>
                    <div className="maleCounter">{this.state.maleWordCount}</div>
                </div>
                <div className="userTextContent" onKeyUp={this.findBias} id="div" contentEditable="true" />
            </div>
        );
    }
}
export default App;
