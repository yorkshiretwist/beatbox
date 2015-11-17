/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
BeatBox = (function () {
    'use strict';
	
	var appContainer,
		sequenceContainer,
		currentSong,
		actions,
		errors;
	
    // Application Constructor
    function initialize(config) {
		
		init();
		
		setupNav();
		
        bindEvents();
    }
	
	function init(){
		actions = getActions();
		errors = getErrors();
		appContainer = document.getElementById('app');
	}
	
	function getActions(){
		return {
			renameSong: 'renameSong',
			renamePattern: 'renamePattern',
			renameInstrument: 'renameInstrument',
			addPattern: 'addPattern',
			addInstrument: 'addInstrument',
			addPatternBar: 'addPatternBar',
			addSequenceSection: 'addSequenceSection',
			showPattern: 'showPattern',
			showSequence: 'showSequence',
			createSong: 'createSong',
			createSongUsingPattern: 'createSongUsingPattern',
			deletePattern: 'deletePattern',
			deleteSong: 'deleteSong',
			deleteInstrument: 'deleteInstrument',
			toggleCell: 'toggleCell'
		};
	}
	
	function getErrors(){
		return {
			nameTooShort: 'The name you have given is too short. Please try again.'
		};
	}
	
	function displayError(error){
		alert(error);
	}
	
	function setupNav(){
		var nav = appendChild(appContainer, 'nav');
		
	}
	
	function loadSong(song) {
		
		currentSong = song;
		appContainer.innerHTML = '';
		
		if (!validateSong(song)){
			alert('Song is not valid');
		}
		
		buildSequenceTable();
		buildPatternTables();
	}
	
	function buildSequenceTable(){
		
		var sections = buildSections();
		
		sequenceContainer = appendChild(appContainer, 'section', {id: 'sequence'}, {songId: currentSong.id});
		
		var h2 = appendChild(sequenceContainer, 'h2');
		var input = appendChild(h2, 'input', {type: 'text', value: currentSong.name, className: 'songName'},{action: actions.renameSong});
		
		for(var i = 0; i < currentSong.patterns.length; i++) {
			
			var pattern = currentSong.patterns[i];
			
			var header = appendChild(sequenceContainer, 'h3', {className: 'header'});
			var button = buildButton({innerHTML: pattern.name, className: 'patternName-' + pattern.id},{action: actions.showPattern, patternId: pattern.id});
			header.appendChild(button);
			
			var list = appendChild(sequenceContainer, 'ul', {}, {patternId: pattern.id});
			
			for(var x = 0; x < sections.length; x++){
				var checked = false;
				var liProperties = {className: 'block'};
				if (sections[x].indexOf(pattern.id) > -1){
					checked = true;
					liProperties = {className: 'block selected'};
				}
				var li = appendChild(list, 'li', liProperties);
				var cellSelector = buildCellSelector(checked, {innerHTML: 'Section ' + x},{sectionIndex: x, patternId: pattern.id});
				li.appendChild(cellSelector);
			}
			
			sequenceContainer.appendChild(list);
		}
		
		var addSectionRow = appendChild(sequenceContainer, 'p');
		appendChild(addSectionRow, 'button', {innerHTML: 'Add section'});
		
		var addPatternRow = appendChild(sequenceContainer, 'p');
		appendChild(addPatternRow, 'button', {innerHTML: 'Add pattern'});
	}
	
	function buildCellSelector(checked, properties, dataItems){
		dataItems.action = actions.toggleCell;
		var label = createElement('label', properties, dataItems);
		appendChild(label, 'input', {type: 'checkbox', value: '1', checked: checked});		
		return label;
	}
	
	function buildButton(properties, dataItems){
		properties.type = 'button';
		var button = createElement('button', properties, dataItems);	
		return button;
	}
	
	function buildSections(){
		var sections = [];
		for(var x = 0; x < currentSong.sequence.length; x++) {
			for(var repeat = 0; repeat < currentSong.sequence[x].repeats; repeat++){
				sections.push(currentSong.sequence[x].patternIds);
			}
		}
		return sections;
	}
	
	function getPattern(patternId){
		for(var pattern = 0; pattern < currentSong.patterns.length; pattern++) {
			if (currentSong.patterns[pattern].id == patternId){
				return currentSong.patterns[pattern];
			}
		}
		return null;
	}
	
	function getInstrument(instrumentId){
		for(var instrument in currentSong.instruments) {
			if (currentSong.instruments[instrument].id == instrumentId){
				return currentSong.instruments[instrument];
			}
		}
		return null;
	}
	
	function buildPatternTables(){
		for(var patternIndex in currentSong.patterns) {
			var pattern = getPattern(patternIndex);
			buildPatternTable(pattern);
		}
	}
	
	function buildPatternTable(pattern) {
				
		var beatsPerBar = currentSong.timeSignature[1];
		var subdivisions = currentSong.subdivisions;
		
		var patternContainer = appendChild(appContainer, 'section', {className: 'pattern'}, {patternId: pattern.id, beatsPerBar: beatsPerBar, subdivisionsPerBeat: subdivisions});
		var h3 = appendChild(patternContainer, 'h3');
		appendChild(h3, 'button', {innerHTML: currentSong.name},{action: actions.showSequence});
		var input = appendChild(h3, 'input', {type: 'text', value: pattern.name},{action: actions.renamePattern, patternId: pattern.id});
		
		for(var i = 0; i < currentSong.instruments.length; i++) {
			
			var instrument = currentSong.instruments[i];
			
			var header = appendChild(patternContainer, 'h3', {className: 'header'});
			appendChild(header, 'input', {type: 'text', value: instrument.name}, {action: actions.renameInstrument, instrumentId: instrument.id});
			
			var list = appendChild(patternContainer, 'ul', {}, {instrumentId: instrument.id});
			
			for(var bar = 0; bar < pattern.bars; bar++) {
				for(var beat = 0; beat < beatsPerBar; beat++) {
					for(var subdivision = 0; subdivision < subdivisions; subdivision++) {
						
						var checked = isNoteSelected(pattern.parts, instrument.id, bar, beat, subdivision);
						
						var className = 'block';
						if (subdivision == subdivisions - 1) {
							className += ' beat';
						}
						if (subdivision == subdivisions - 1 && beat == beatsPerBar - 1) {
							className += ' finalBarBeat';
						}
						if (checked){
							className += ' selected';
						}
						
						var li = appendChild(list, 'li', {className: className}, {bar: bar, beat: beat, subdivision: subdivision});
						var cellSelector = buildCellSelector(checked, {innerHTML: 'Bar ' + bar + ', beat ' + beat + ', subdivision ' + subdivision},{bar: bar, beat: beat, subdivision: subdivision});
						li.appendChild(cellSelector);						
					}
				}
			}
			
			patternContainer.appendChild(list);
		}
		
		var addBarRow = appendChild(patternContainer, 'p');
		appendChild(addBarRow, 'button', {innerHTML: 'Add bar'});//addPatternBar
		
		var addInstrumentRow = appendChild(patternContainer, 'p');
		appendChild(addInstrumentRow, 'button', {innerHTML: 'Add instrument'});
	}
	
	function isNoteSelected(parts, instrumentId, bar, beat, subdivision){
		for(var partIndex in parts){
			if (parts[partIndex].instrumentId == instrumentId){
				return noteExistsInPart(parts[partIndex], bar, beat, subdivision);
			}
		}
		return false;
	}
	
	function noteExistsInPart(part, bar, beat, subdivision){
		for(var noteIndex in part.notes){
			var note = part.notes[noteIndex];
			if (note.bar == bar && note.beat == beat && note.subdivision == subdivision){
				return true;
			}
		}
		return false;
	}
	
	function validateSong(song){
		return true;
	}
	
	function createElement(elementType, properties, dataItems){
		var element = document.createElement(elementType);
		for (var property in properties) {
			if (properties.hasOwnProperty(property)){
				element[property] = properties[property];
			}
		}
		for (var dataItem in dataItems) {
			element.dataset[dataItem] = dataItems[dataItem];
		}
		return element;
	}
	
	function appendChild(parentElement, elementType, properties, dataItems){
		var childElement = createElement(elementType, properties, dataItems);
		parentElement.appendChild(childElement);
		return childElement;
	}
	
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    function bindEvents() {
        document.addEventListener('deviceready', onDeviceReady, false);
		document.addEventListener('click', onTrigger, false);
		document.addEventListener('change', onTrigger, false);
		document.addEventListener('keyup', onTrigger, false);
    }
	
	function onTrigger(e){
		var targetElement = event.target || event.srcElement;
		if (!targetElement){
			return true;
		}
		
		var action = targetElement.dataset.action;
		
		if (action == actions.showPattern){
			showPattern(targetElement);
		}
		
		if (action == actions.renamePattern){
			renamePattern(targetElement);
		}
		
		if (action == actions.renameSong){
			renameSong(targetElement);
		}
		
		if (action == actions.renameInstrument){
			renameInstrument(targetElement);
		}
		
		if (action == actions.toggleCell){
			toggleCell(targetElement);
		}
		
		if (action == actions.showSequence){
			showSequence();
		}
		
		if (action == actions.addPattern){
			addPattern();
		}
	}
	
	function showSequence(){
		var patterns = document.querySelectorAll('.pattern');
		for(var i = 0; i < patterns.length; i++){
			patterns[i].style.display = 'none';
		}
		sequenceContainer.style.display = 'block';
	}
	
	function showPattern(targetElement){
		sequenceContainer.style.display = 'none';
		var pattern = document.querySelector('.pattern[data-pattern-id="' + targetElement.dataset.patternId + '"]');
		pattern.style.display = 'block';
	}
	
	function renamePattern(targetElement){
		var pattern = getPattern(targetElement.dataset.patternId);
		var previousName = pattern.name;
		if (targetElement.value.trim().length == 0){
			targetElement.value = previousName;
			displayError(errors.nameTooShort);
			return;
		}
		pattern.name = targetElement.value;
		var elements = document.querySelectorAll('.patternName-' + targetElement.dataset.patternId);
		for(var i =0; i < elements.length; i++){
			elements[i].innerHTML = pattern.name;
		}
	}
	
	function renameSong(targetElement){
		var previousName = currentSong.name;
		if (targetElement.value.trim().length == 0){
			targetElement.value = previousName;
			displayError(errors.nameTooShort);
			return;
		}
		currentSong.name = targetElement.value;
		var elements = document.querySelectorAll('.songName');
		for(var i =0; i < elements.length; i++){
			elements[i].innerHTML = currentSong.name;
		}
	}
	
	function renameInstrument(targetElement){
		var instrument = getInstrument(targetElement.dataset.instrumentId);
		var previousName = instrument.name;
		if (targetElement.value.trim().length == 0){
			targetElement.value = previousName;
			displayError(errors.nameTooShort);
			return;
		}
		instrument.name = targetElement.value;
		var elements = document.querySelectorAll('.instrumentName-' + targetElement.dataset.instrumentId);
		for(var i =0; i < elements.length; i++){
			elements[i].innerHTML = instrument.name;
		}
	}
	
	function addPattern(){
		var sequenceTable = document.getElementById('sequenceTable');
		var cells = sequenceTable.querySelectorAll('td.block');
	}
	
	function toggleCell(targetElement){
		var cell = targetElement.parentElement;
		if (cell.classList.contains('selected')){
			cell.classList.remove('selected');
			return;
		}
		cell.classList.add('selected');
	}
	
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    function onDeviceReady() {
        
    }
	
	return {
		initialize: initialize,
		loadSong: loadSong
	}
});
var beatBox = new BeatBox();