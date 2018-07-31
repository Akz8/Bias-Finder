import React, { Component } from 'react';
import './index.css';
import {maleWords, femWords} from './words';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newText: ' ',
            femWordCount: 0,
            maleWordCount: 0,
            userText: ''
        };
        this.handleInput = this.handleInput.bind(this);
        this.findWords = this.findWords.bind(this);
        this.setCaretPosition = this.setCaretPosition.bind(this);
        this.biasedWordCount = this.biasedWordCount.bind(this);
        this.displayAltWords = this.displayAltWords.bind(this);
        this.replaceBiasWordWithAltWord = this.replaceBiasWordWithAltWord.bind(this);
        this.removeHtmlFormatting = this.removeHtmlFormatting.bind(this);
        this.getCaretPosition = this.getCaretPosition.bind(this);
        this.getTextNode = this.getTextNode.bind(this);
        this.getSelectionNode = this.getSelectionNode.bind(this);
    }

    findWords(oldCaretPosition, oldCaretNode) {
        let userText = document.getElementById('userContent').textContent;
        let femWordsArr = Object.keys(femWords);
        let maleWordsArr = Object.keys(maleWords);
        let maleWordsJoined = maleWordsArr.join('|');
        let maleRegex = new RegExp('\\b(' + maleWordsJoined + ')', 'gi');
        let femWordsJoined = femWordsArr.join('|');
        let femRegex = new RegExp('\\b(' + femWordsJoined + ')', 'gi'); 
        let newText = userText.replace(femRegex, function(matched){
            if(femWords[matched] == null){
                return '<div class=purpleBorder>'+matched+'</div>';
            }
            let altWords = femWords[matched];
            let altElements = '';
            for(let i=0; i<altWords.length; i++){
    
              altElements += '<li>'+altWords[i]+'</li>'
            }
            return '<div class=purpleBorder>'+matched+'<ul class=hidden>'+altElements+'</ul></div>';
          });
        newText = newText.replace(maleRegex, function(matched){
            if(maleWords[matched] == null){
                return '<div class=blueBorder>'+matched+'</div>';
            }
            let altWords = maleWords[matched];
            let altElements ='';
            for(let i=0; i<altWords.length; i++){
                altElements += '<li>'+altWords[i]+'</li>'
            }
            return '<div class=blueBorder>'+matched+ '<ul class=hidden>'+altElements+'</ul></div>';
        });
        let userContent = document.getElementById('userContent');
        userContent.innerHTML = newText;
        this.setCaretPosition(oldCaretPosition, oldCaretNode);
        this.biasedWordCount(userContent);
        this.displayAltWords(userContent);
      }
    
      biasedWordCount(userContent) {
        let femCount = userContent.getElementsByClassName('purpleBorder').length;
        if (femCount) {
            this.setState({femWordCount: femCount});
        } else {
            this.setState({femWordCount: 0})
        }
        let maleCount = userContent.getElementsByClassName('blueBorder').length;
        if(maleCount) {
            this.setState({maleWordCount: maleCount});
        } else {
            this.setState({maleWordCount: 0});
        }
      }

      displayAltWords(userContent) {
        let highlightedEl = userContent.getElementsByTagName('div')
        if(highlightedEl.length > 0){
            for(let i=0; i<highlightedEl.length; i++) {
                highlightedEl[i].addEventListener('mouseover', function(){
                    if(this.childNodes[1]){
                        this.childNodes[1].classList.replace('hidden', 'visible');
                    }
                });
                highlightedEl[i].addEventListener('mouseout', function(){
                    if(this.childNodes[1]){
                        this.childNodes[1].classList.replace('visible', 'hidden');
                    }   
                })
            }
        }
        this.replaceBiasWordWithAltWord();
      }
      
      replaceBiasWordWithAltWord() {
        let highlightedText = document.getElementById('userContent');
        let biasedWords = highlightedText.getElementsByTagName('div');
        for(let i=0; i<biasedWords.length; i++) {
            let childrenAltWords = biasedWords[i].getElementsByTagName('li');
            for(let j=0; j<childrenAltWords.length; j++) {
                let self = this
                childrenAltWords[j].addEventListener('click', function(e){
                    console.log(e)
                    if(e.target.parentNode.parentNode.className === 'purpleBorder'){
                        e.target.parentNode.parentNode.classList.remove('purpleBorder');
                    } else if(this.parentElement.parentElement.className === 'blueBorder'){
                        this.parentElement.parentElement.classList.remove('blueBorder');
                    }                    
                    this.parentElement.parentElement.textContent = this.textContent;
                    self.biasedWordCount(document.getElementById('userContent'));
                })
            }
        }
      };
        
      removeHtmlFormatting(oldCaretPosition) {
        let alteredUserContent = document.getElementById('userContent');
        //code below removes the uls
        let listOfSpans = alteredUserContent.getElementsByTagName('div');
        for(let i=0; i<listOfSpans.length; i++){
            while(listOfSpans[i].childNodes[1]) listOfSpans[i].removeChild(listOfSpans[i].childNodes[1])
        }
        //this code removes the spans
        let withoutUls = document.getElementById('userContent');
        let highlightedContainer = withoutUls.getElementsByTagName('div');
        while(highlightedContainer.length){
            let parent = highlightedContainer[0].parentNode;
            while(highlightedContainer[0].firstChild) {
                parent.insertBefore(highlightedContainer[0].firstChild, highlightedContainer[0]);
            }
            parent.removeChild(highlightedContainer[0]);
        }
        this.findWords(oldCaretPosition);
      }
         
      handleInput(e){
        if(e.keyCode === 13 || e.keyCode === 46 || e.keyCode === 32){
            let {caretPos: oldCaretPosition, caretNodeIndex: oldCaretNode} = this.getCaretPosition(document.getElementById('userContent'));
            if(document.getElementById('userContent').children.length > 0){
                this.removeHtmlFormatting(oldCaretPosition);
            } else {
                this.findWords(oldCaretPosition, oldCaretNode);
            }
            this.biasedWordCount(document.getElementById('userContent'));
        }
      }

      getCaretPosition(editableDiv) {
        let caretPos = 0,
          sel, range, caretNodeIndex;
        if (window.getSelection) {
          sel = window.getSelection();
          if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            caretPos = range.endOffset;
            let caretNode = range.endContainer;
            caretNodeIndex = Array.from(range.commonAncestorContainer.parentNode.childNodes).indexOf(caretNode)
            for (let i = 0; i < caretNodeIndex; i++) {
                let childNode = range.commonAncestorContainer.parentNode.childNodes[i]
                caretPos += this.getTextNode(childNode).textContent.length
            }
          }
        } else if (document.selection && document.selection.createRange) {
          range = document.selection.createRange();
          if (range.parentElement() === editableDiv) {
            let tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            let tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
          }
        }
        return {caretPos, caretNodeIndex}
      }
    
      getTextNode(node){
        if (node.className === 'purpleBorder' || node.className === 'blueBorder') {
            node = node.childNodes[0]
        }
        return node
      }
    
      getSelectionNode(userContentNode, caretPosition){
        let currentNode = userContentNode.childNodes[0]
        let i = 0
        while (caretPosition > this.getTextNode(currentNode).textContent.length) {
            caretPosition -= this.getTextNode(currentNode).textContent.length
            currentNode = userContentNode.childNodes[++i]
        }
        return {currentNode, caretPosition}
      }
      
      setCaretPosition(oldCaretPosition){
        let el = document.getElementById("userContent");
        let {currentNode, caretPosition} = this.getSelectionNode(el, oldCaretPosition)
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(this.getTextNode(currentNode), caretPosition);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }

    render() {
        return (
            <div>
                <h1 className="headingTitle">Bias Highlighter</h1>
                <div className="counterContainer">
                    <div className="femCounter" id='femCircle'>{this.state.femWordCount}</div>
                    <div className="maleCounter" id='maleCircle'>{this.state.maleWordCount}</div>
                </div>
                <div className="userTextContent" onKeyUp={this.handleInput} id="userContent" contentEditable="true" />
            </div>
        );
    }
}
export default App;
