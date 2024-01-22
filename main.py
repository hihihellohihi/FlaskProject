from flask import Flask, url_for
from flask import render_template
from flask import jsonify, request
import insertionsort
import quicksort
import random
from random import shuffle

from Node import Node

app = Flask(__name__)


# @app.route('/hello/')
# @app.route('/hello/<name>')
# def hello(name=None):
#     return render_template('hello.html', name=name)


# @app.route('/')
# def home_page():
#     example_embed = 'This string is from python'
#     return render_template('miniTutorialTemplate.html', embed=example_embed)


@app.route('/test', methods=['GET', 'POST'])
def testfn():
    # Get request
    if request.method == 'GET':
        message = {'greeting': 'Hello from Flask!'}
        return jsonify(message)

    # POST request
    if request.method == 'POST':
        print(request.get_json())
        return 'Success', 200


@app.route('/')
def home_page():
    example_embed = 'This string is from python'
    return render_template('ProjectAnimation.html', embed=example_embed)


firstIteration = True


@app.route('/insertion', methods=['GET', 'POST'])
def insertion():
    """
    Returns a list of lists, each containing a list of the list after that iteration of sorting
    and the index to be animated.
    :return: something, put later
    """
    global firstIteration
    # GET requesst
    if request.method == 'GET':
        # idk what I'm doing tbh
        listof100init = list(range(25))
        listof100 = []
        random.shuffle(listof100init)
        for index in range(len(listof100init)):
            listof100.append(Node(index, listof100init[index], 0, 0))
        # send it!
        return jsonify(insertionsort.insertionsort_to_end_as_lists(listof100))


@app.route('/quick', methods=['GET', 'POST'])
def quick():
    """
    Returns a list of lists, each containing a list of the list after that iteration of sorting
    and the index to be animated.
    :return: something
    """
    global firstIteration
    # GET requesst
    if request.method == 'GET':
        # idk what I'm doing tbh
        listof100init = list(range(20))
        listof100 = []
        random.shuffle(listof100init)
        for index in range(len(listof100init)):
            listof100.append(Node(index, listof100init[index], 0, 0))
        # send it!
        sentList = quicksort.quicksort_to_end_as_lists(listof100)
        return jsonify(sentList)

if __name__ == '__main__':    app.run(debug=True)
