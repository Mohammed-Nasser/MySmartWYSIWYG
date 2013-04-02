(function( $ ) {
	var editorDoc;
	
	$.fn.MySmartEditor = function() 
	{
		initEditor( this );
	}
	
	this.getEditorDoc = function()
	{
		return this.editorDoc;
	}
	
	this.getSelectionLines = function()
	{
		var selection = getEditorDoc().getSelection();
		var range = selection.getRangeAt( 0 );
		
		var text = selection.toString();
		
		return text.split( "\n" );
	}
	
	this.addTagToText = function( textLines, tag )
	{
		var newContainer = getEditorDoc().createElement( "span" );
		
		newContainer.appendChild( document.createTextNode( "[" + tag + "]" ) );
		newContainer.appendChild( document.createElement( "br" ) );
		
		var lines = textLines;
		
		for ( var k = 0; k < lines.length; k++ )
		{
			newContainer.appendChild( document.createTextNode( lines[ k ] ) );
			newContainer.appendChild( document.createElement( "br" ) );
		}
		
		newContainer.appendChild( document.createTextNode( "[/" + tag + "]" ) );
		
		getEditorDoc().execCommand( "insertHTML", false, newContainer.innerHTML );
	}
	
	this.initEditor = function( parent )
	{
		initToolbar( parent );
		initWorkingSpace( parent );
		implementToolbarCommands();
	}
	
	this.initToolbar = function( parent )
	{
		toolbar = $( '<div id="toolbar"><ul></ul></div><br /><div id="toolbar_option"></div>' );
		
		parent.append( toolbar );
		
		$( "#toolbar_option" ).hide();
		
		$( "#toolbar ul" ).append( '<li class="bold cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="italic cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="underline cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );
		$( "#toolbar ul" ).append( '<li class="link cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="image cmd"></li>' )
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );;
		$( "#toolbar ul" ).append( '<li class="code cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="quote cmd"></li>' );
		$( "#toolbar ul" ).append( '<li class="seperator"></li>' );;
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_family_n" id="font_family"><option selected="selected" value="fontfamily_title">Font-family</option><option value="Arial">Arial</option><option value="Tahoma">Tahoma</option></select></li>' );
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_color_n" id="font_color"><option selected="selected" value="fontcolor_title">Font-color</option><option value="#ff0000" style="color: #ff0000;">Red</option><option value="#0000ff" style="color: #0000ff;">Blue</option></select></li>' );
		$( "#toolbar ul" ).append( '<li class="list"><select name="font_size_n" id="font_size"><option selected="selected" value="fontsize_title">Font-size</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></li>' );
	}
	
	this.initWorkingSpace = function( parent )
	{
		var editorFrame = $( '<iframe id="editor_frame"></iframe>' );
		editorFrame.addClass( "editor" );
		
		parent.append( editorFrame );
		
		var element = editorFrame.get( 0 )
		
		this.editorDoc = element.contentDocument;
		
		this.editorDoc.designMode = 'on';
		this.editorDoc.open();
		
		this.editorDoc.write( '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ar"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><link type="text/css" href="MySmartEditor.css" rel="stylesheet" /></head><body class="editor_text"></body></html>' );
		
		this.editorDoc.close();
		
		element.contentWindow.focus();
	}
	
	this.implementToolbarCommands = function()
	{
		$( ".bold" ).on( "click", function() { getEditorDoc().execCommand( 'bold', false, null ); } );
		$( ".italic" ).on( "click", function() { getEditorDoc().execCommand( 'italic', false, null ); } );
		$( ".underline" ).on( "click", function() { getEditorDoc().execCommand( 'underline', false, null ); } );
		$( ".link" ).on( "click", function() 
		{
			$( "#option_content" ).remove();
			$( "#toolbar_option" ).append( '<span id="option_content">Link : <input type="text" id="link" /><input type="button" id="insert_link" value="Insert"></span>' );
			$( "#toolbar_option" ).fadeToggle(); 
			
			$( "#insert_link" ).on( "click", function() {
				getEditorDoc().execCommand( 'createlink', false, $( "#link" ).val() );
				$( "#toolbar_option" ).fadeToggle( 400, "swing", function() { $( "#option_content" ).remove(); } );
			});
		} );
		
		$( ".image" ).on( "click", function() 
		{ 
			$( "#option_content" ).remove();
			$( "#toolbar_option" ).append( '<span id="option_content">Image\'s Link : <input type="text" id="link" /><input type="button" id="insert_image" value="Insert"></span>' );
			$( "#toolbar_option" ).fadeToggle(); 
		
			$( "#insert_image" ).on( "click", function() {
				getEditorDoc().execCommand( 'insertImage', false, $( "#link" ).val() );

				$( "#toolbar_option" ).fadeToggle( 400, "swing", function() { $( "#option_content" ).remove(); } );
			});
		} );
		
		$( ".code" ).on( "click", function() 
		{
			addTagToText( getSelectionLines(), "code" );
		} );
		
		$( ".quote" ).on( "click", function() 
		{
			addTagToText( getSelectionLines(), "quote" );
		} );
		
		$( "#font_family" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'fontName', false, $( this ).val() );
			
			$( "#font_family" ).prop( "selectedIndex", 0 );
		});
		
		$( "#font_color" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'foreColor', false, $( this ).val() );
			
			$( "#font_color" ).prop( "selectedIndex", 0 );
		});
		
		$( "#font_size" ).on( "change", function() 
		{
			getEditorDoc().execCommand( 'fontSize', false, $( this ).val() );
			
			$( "#font_size" ).prop( "selectedIndex", 0 );
		});
		
		$( "#show_html" ).on( "click", function() 
		{ 
			alert( getEditorDoc().body.innerHTML );
		} );
	}
})(jQuery);