from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app, db
from app.forms import LoginForm, RegistrationForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Save
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

click1base = upgrades(0, 1, 10, 1.1)
click2base = upgrades(0, 10, 100, 1.1)
auto1base = upgrades(0, 1, 100, 1.2)
auto2base = upgrades(0, 10, 3000, 1.5)

points = {}
score  = {}
click1 = {}
click2 = {}
auto1  = {}
auto2  = {}

@app.route('/')
@app.route('/index', methods=['GET', 'POST'])
@login_required
def index():
    global points
    if(db.session.execute("SELECT click1 FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0] != None):
        points[current_user.get_id()] = db.session.execute("SELECT point FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0]
        score[current_user.get_id()]  = db.session.execute("SELECT score FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0]
        click1[current_user.get_id()] = upgrades(db.session.execute("SELECT click1 FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0], 1,  10,   1.1)
        click2[current_user.get_id()] = upgrades(db.session.execute("SELECT click2 FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0], 10, 100,  1.1)
        auto1[current_user.get_id()]  = upgrades(db.session.execute("SELECT auto1 FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0],  1,  100,  1.2)
        auto2[current_user.get_id()]  = upgrades(db.session.execute("SELECT auto2 FROM Save WHERE user_id={}".format(current_user.get_id())).all()[0][0],  10,  3000,  1.2)
    else:
        print(f"new user: {db.session.execute(f'SELECT username FROM User WHERE id={current_user.get_id()}')}!!!")
        points[current_user.get_id()] = 0
        score[current_user.get_id()] = 0
        click1[current_user.get_id()] = upgrades(0, 1, 10, 1.1)
        click2[current_user.get_id()] = upgrades(0, 10, 100, 1.1)
        auto1[current_user.get_id()]= upgrades(0, 1, 100, 1.2)
        auto2[current_user.get_id()]= upgrades(0, 10, 3000, 1.5)
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

@app.route('/leaderboard', methods=['POST', 'GET'])
def leaderboard():
    scores = {
        "placeholder": 69420,
        "dinmor": 42069,
    }
    for userScore in db.session.execute("SELECT * FROM Save ORDER BY score DESC").all():
        scores[db.session.execute("SELECT username FROM User WHERE id={}".format(userScore[2])).all()[0][0]] = round(userScore[3])
    cUser = db.session.execute("SELECT username FROM User WHERE id={}".format(current_user.get_id())).all()[0][0]
    return render_template("leaderboard.html", title="leaderboard", scores=scores, cUser=cUser)

@app.route('/api/update')
def updateData():
    return jsonify({
        "points":    points[current_user.get_id()],
        "click1p":   click1[current_user.get_id()].calcPrice(),
        "click2p":   click2[current_user.get_id()].calcPrice(),
        "auto1p":    auto1[current_user.get_id()].calcPrice(),
        "auto2p":    auto2[current_user.get_id()].calcPrice(),
        "perClick":  click1[current_user.get_id()].n * click1[current_user.get_id()].per + click2[current_user.get_id()].n * click2[current_user.get_id()].per + 1,
        "perSecond": auto1[current_user.get_id()].n * auto1[current_user.get_id()].per + auto2[current_user.get_id()].n * auto2[current_user.get_id()].per,
    })

@app.route('/api/click', methods=['POST'])
def click():
    global points
    global score
    points[current_user.get_id()] += click1[current_user.get_id()].n * click1[current_user.get_id()].per + click2[current_user.get_id()].n * click2[current_user.get_id()].per + 1
    score[current_user.get_id()]  += click1[current_user.get_id()].n * click1[current_user.get_id()].per + click2[current_user.get_id()].n * click2[current_user.get_id()].per + 1
    return jsonify({'success': True})

@app.route('/api/upgrade', methods=['POST'])
def upgrade():
    global points
    print(request.json['n'])
    if request.json['n'] == 0 and points[current_user.get_id()] >= click1[current_user.get_id()].calcPrice():
        points[current_user.get_id()] -= click1[current_user.get_id()].calcPrice()
        click1[current_user.get_id()].n += 1
    elif request.json['n'] == 1 and points[current_user.get_id()] >= click2[current_user.get_id()].calcPrice():
        points[current_user.get_id()] -= click2[current_user.get_id()].calcPrice()
        click2[current_user.get_id()].n += 1
    elif request.json['n'] == 2 and points[current_user.get_id()] >= auto1[current_user.get_id()].calcPrice():
        points[current_user.get_id()] -= auto1[current_user.get_id()].calcPrice()
        auto1[current_user.get_id()].n += 1
    elif request.json['n'] == 3 and points[current_user.get_id()] >= auto2[current_user.get_id()].calcPrice():
        points[current_user.get_id()] -= auto2[current_user.get_id()].calcPrice()
        auto2[current_user.get_id()].n += 1
    return jsonify({'success': True})

@app.route('/api/auto', methods=['POST'])
def auto():
    global points
    global score

    points[current_user.get_id()] += auto1[current_user.get_id()].n * auto1[current_user.get_id()].per + auto2[current_user.get_id()].n * auto2[current_user.get_id()].per
    score[current_user.get_id()]  += auto1[current_user.get_id()].n * auto1[current_user.get_id()].per + auto2[current_user.get_id()].n * auto2[current_user.get_id()].per
    return jsonify({'success': True})

@app.route('/api/save', methods=['POST'])
def save():
    if current_user.get_id() != None:
        db.session.execute("DELETE FROM Save WHERE user_id={}".format(current_user.get_id()))
        save = Save(
            point  = points[current_user.get_id()],
            user   = current_user,
            score  = score[current_user.get_id()],
            click1 = click1[current_user.get_id()].n,
            click2 = click2[current_user.get_id()].n,
            auto1  = auto1[current_user.get_id()].n,
            auto2  = auto2[current_user.get_id()].n,
        )
        db.session.add(save)
        db.session.commit()
    return jsonify({'success': True})
