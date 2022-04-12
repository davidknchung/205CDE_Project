from flask import Flask, render_template, flash, redirect, url_for, session, logging, request
import pymysql
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt
app = Flask(__name__, template_folder='templates')
app.secret_key = "Flask App"

db = pymysql.connect (host="localhost", user="root", password="password", database="projectflask")


@app.route('/')
def index():
	return render_template('index.html')

class RegisterForm(Form):
    name = StringField('Full Name', [validators.length(min=1, max=50)])
    username = StringField('Username', [validators.length(min=5, max=25)])
    email = StringField('Email', [validators.length(min=6, max=50)])
    password = PasswordField('Password', [validators.DataRequired(), validators.EqualTo('confirm', message = 'Password do not match')])
    confirm = PasswordField('Confirm Password')

@app.route('/register' , methods = ['GET', "POST"])
def register():
	form = RegisterForm(request.form)
	if request.method == "POST" and form.validate():
		name = form.name.data
		email = form.email.data
		username = form.username.data
		password = sha256_crypt.hash(str(form.password.data))

		cursor = db.cursor()
		cursor.execute("INSERT INTO users(name, email, username, password) VALUES(%s, %s, %s, %s)", (name, email, username, password))

		db.commit()
		db.close()

		return redirect(url_for('login'))


		return render_template('register.html')
	return render_template('register.html', form = form)

@app.route('/login', methods=["GET", "POST"])
def login():
	if request.method == "POST":
		username = request.form['username']
		password_candidate = request.form['password']

		cursor = db.cursor()
		db.ping(reconnect=True)

		result = cursor.execute("select * from users where username= %s", [username])
		if result > 0:
			data = cursor.fetchone()
			password = data[4]

			if sha256_crypt.verify(password_candidate, password):
				session['logged_in'] = True
				session['username'] = username

				return redirect(url_for('dashboard'))

			else:
				error = 'Invalid login'
				return render_template('login.html', error = error)
			cursor.close()
		else:
			error = 'Username not found'
			return render_template('login.html', error = error)
	return render_template('login.html')

@app.route('/logout')
def logout():
	session.clear()
	return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
	return render_template('dashboard.html')

if __name__ == '__main__':
	app.run(debug=True)