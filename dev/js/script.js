let
		firebaseConfig = {
			apiKey:            "AIzaSyD348S4nMk7b2gC1pG7yTvmbgQphNh-eGM",
			authDomain:        "cm-4-4-4-4.firebaseapp.com",
			databaseURL:       "https://cm-4-4-4-4.firebaseio.com",
			projectId:         "cm-4-4-4-4",
			storageBucket:     "cm-4-4-4-4.appspot.com",
			messagingSenderId: "282059051695",
			appId:             "1:282059051695:web:bddb73f7de564ed2"
		},
		db             = firebase.initializeApp( firebaseConfig ).database(),
		booksRef       = db.ref( 'books' ),
		usersRef       = db.ref( 'users' ),


		emailRE        = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

Vue.component( 'modal', {
	props:    [
		'title'
	],
	template: `
		<div class="modal" role="dialog">
			<div class="modal-bg"></div>
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">{{ title }}</h5>
						<button @click="$emit('close')" type="button" class="close" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<slot name="modal-body">
							Modal Body
						</slot>
					</div>
					<div class="modal-footer">
						<slot name="modal-footer">
							<button @click="$emit('close')" type="button" class="btn btn-secondary">Close</button>
						</slot>
					</div>
				</div>
			</div>
		</div>`
} );

new Vue( {
	el:       '#app',
	data:     {
		newUser:         {
			name:  '',
			email: ''
		},
		newBook:         {
			author:      '',
			img:         '',
			isbn:        '',
			title:       '',
			year:        '',
			description: ''
		},
		reserveInfo:     {
			isbn:       '0735214484',
			email:      '',
			returnDate: '25.12.12'
		},
		modalShowEdit:   false,
		modalShowBorrow: false,
		modalShowRemove: false,
		bookKey:         '',
		currentBook:     {}
	},
	firebase: {
		books: booksRef,
		users: usersRef
	},
	computed: {
		validation: function () {
			return {
				name:  !!this.newUser.name.trim(),
				email: emailRE.test( this.newUser.email )
			}
		},
		isValid:    function () {
			var validation = this.validation;
			return Object.keys( validation ).every( function ( key ) {
				return validation[ key ]
			} )
		}
	},
	methods:  {
		addUser:           function () {
			if ( this.isValid ) {
				usersRef.push( this.newUser );
				this.newUser.name  = '';
				this.newUser.email = '';
			}
		},
		removeUser:        function ( user ) {
			usersRef.child( user[ '.key' ] ).remove()
		},
		addBook:           function () {
			booksRef.push( this.newBook );
			this.newBook.author      = '';
			this.newBook.img         = '';
			this.newBook.isbn        = '';
			this.newBook.title       = '';
			this.newBook.year        = '';
			this.newBook.description = '';
			this.newBook.genre       = '';
		},
		modalToggleRemove: function ( book ) {
			this.currentBook = book;
			this.modalShowRemove = !this.modalShowRemove;
		},
		removeBook:        function ( key ) {
			this.modalToggleRemove();
			booksRef.child( key ).remove()
		},
		modalToggleEdit:   function () {
			this.modalShowEdit = !this.modalShowEdit;
		},
		editBook:          function ( book ) {
			this.modalToggleEdit();
		},
		modalToggleBorrow: function () {
			this.modalShowBorrow = !this.modalShowBorrow;
		},
		borrowBook:        function ( book ) {
			this.modalToggleBorrow();
		},
		returnBook:        function ( book ) {
			book.balance += 1;
			console.log( book.balance );
		},
		reserveBook:       function () {
			let
					qrcode         = new QRCode( document.querySelector( '#qrcode' ), {
						width:  100,
						height: 100,
						useSVG: true
					} ),
					objReserveInfo = {
						isbn:       this.reserveInfo.isbn,
						email:      this.reserveInfo.email,
						returnDate: this.reserveInfo.returnDate
					};
			console.log( JSON.stringify( objReserveInfo ) );
			qrcode.makeCode( JSON.stringify( objReserveInfo ) )
		}
	}
} );
