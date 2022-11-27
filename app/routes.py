from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app, db
from app.forms import LoginForm, RegistrationForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from werkzeug.urls import url_parse
from dataclasses import dataclass
import threading

@dataclass
class upgrades:
    n: int
    per: float
    baseprice: int
    pricescale: float

    def calcPrice(self):
        return self.baseprice * self.pricescale ** self.n

click1 = upgrades(0, 1, 10, 1.1)
click2 = upgrades(0, 10, 100, 1.1)

auto1 = upgrades(0, 1, 100, 1.2)
auto2 = upgrades(0, 10, 3000, 1.5)
points = 0

@app.route('/')
@app.route('/index', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('index.html', title='Home')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('You are now registered')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/api/update')
def updateData():
    return jsonify({
        "points":    points,
        "click1p":   click1.calcPrice(),
        "click2p":   click2.calcPrice(),
        "auto1p":    auto1.calcPrice(),
        "auto2p":    auto2.calcPrice(),
        "perClick":  click1.n * click1.per + click2.n * click2.per + 1,
        "perSecond": auto1.n * auto1.per + auto2.n * auto2.per,
    })

@app.route('/api/click', methods=['POST'])
def click():
    global points
    points += click1.n * click1.per + click2.n * click2.per + 1
    return jsonify({'success': True})

@app.route('/api/upgrade', methods=['POST'])
def upgrade():
    global points
    print(request.json['n'])
    if request.json['n'] == 0 and points >= click1.calcPrice():
        points -= click1.calcPrice()
        click1.n += 1
    elif request.json['n'] == 1 and points >= click2.calcPrice():
        points -= click2.calcPrice()
        click2.n += 1
    elif request.json['n'] == 2 and points >= auto1.calcPrice():
        points -= auto1.calcPrice()
        auto1.n += 1
    elif request.json['n'] == 3 and points >= auto2.calcPrice():
        points -= auto2.calcPrice()
        auto2.n += 1
    return jsonify({'success': True})

@app.route('/api/auto', methods=['POST'])
def auto():
    global points
    points += auto1.n * auto1.per + auto2.n * auto2.per
    return jsonify({'success': True})
