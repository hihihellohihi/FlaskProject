class Node:
    """
    4 values:
    - index: which strip this Node is paired with
    - value: the randomly sorted value associated with this Node
    - change: the change in index for this Node the previous iteration
    - grouping: what other strips this Node's strip should move with
    """
    def __init__(self, index, value, change, grouping):
        self.index = index
        self.value = value
        self.change = change
        self.grouping = grouping
        self.highlight = -1

    def __str__(self):
        return str(self.value)

    def __repr__(self):
        return self.__str__()

    def returnAsList(self):
        return [self.index, self.value, self.change, self.grouping, self.highlight]
