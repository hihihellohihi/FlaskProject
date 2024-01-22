import random
from typing import List
from Node import Node


def insertionsort(current_list: List[Node], index: int) -> List:
    """
    Performs a single iteration of insertion sort on the given list
    at the given index. Assumes all nodes in the list currently have change = 0.
    :param current_list: the list to undergo 1 iteration of sorting
    :param index: the current index of the list
    :return:
        - new_list: the list after 1 iteration of insertion sort
        - new_index: the next index to "insert", or -1 if the sort is complete
    """
    sorting_index = index
    if index >= len(current_list):
        return [current_list, -1]
    current_list[sorting_index].highlight = 0
    current_grouping = 1
    current_list[sorting_index].grouping = 0
    while sorting_index > 0:
        if current_list[sorting_index].value > current_list[sorting_index-1].value:
            break
        current_list[sorting_index].change -= 1
        current_list[sorting_index - 1].change += 1
        current_list[sorting_index - 1].grouping = current_grouping
        # current_list[sorting_index - 1].highlight = 255
        current_grouping += 1
        current_list[sorting_index], current_list[sorting_index-1] = current_list[sorting_index-1], current_list[sorting_index]
        sorting_index -= 1
    return [current_list, index]


def insertionsort_to_end_as_lists(current_list: List[Node]) -> List:
    result = []
    for i in range(len(current_list)):
        full_list = insertionsort(current_list, i)
        one_iteration_result = []
        result_in_lists = []
        for node in current_list:
            result_in_lists.append(node.returnAsList())
            node.change = 0
            node.highlight = -1
        one_iteration_result.append(result_in_lists)
        one_iteration_result.append(full_list[1])
        result.append(one_iteration_result)
    return result


if __name__ == '__main__':
    node4 = Node(0, 4, 0, 0)
    node1 = Node(0, 1, 0, 0)
    print(insertionsort([node4, node4, node4, node1], 3))
    print(insertionsort([node4, node4, node4, node4], 4))
    l = list(range(4))
    l2 = []
    random.shuffle(l)

    for index in range(len(l)):
        l2.append(Node(index, l[index], 0, 0))
    
    sorted_list = insertionsort_to_end_as_lists(l2)
    for x in sorted_list:
        print(x)
