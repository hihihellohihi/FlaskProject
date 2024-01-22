import random
from typing import List
from Node import Node


def quicksort(current_list: List[Node], index: int, end: int) -> List:
    """
    Performs a single iteration of quick sort on the given list
    at the given index. Assumes all nodes in the list currently have change = 0.
    :param current_list: the list to undergo 1 iteration of sorting
    :param index: the current index of the list
    :param end: the ending index to swap large numbers with
    :return:
        - new_list: the list after 1 iteration of insertion sort
        - new_index: the next index to "insert", or -1 if the sort is complete
        - new_end: the next ending index to swap large numbers with
    """
    sorting_index = index
    current_list[sorting_index].highlight = 0
    if index >= len(current_list):
        return [current_list, -1]
    if current_list[sorting_index].value >= current_list[sorting_index+1].value:
        current_list[sorting_index].change += 1
        current_list[sorting_index+1].change -= 1
        current_list[sorting_index+1].grouping = 1
        current_list[sorting_index+1].highlight = 100
        current_list[sorting_index], current_list[sorting_index+1] = current_list[sorting_index+1], current_list[
            sorting_index]
        return [current_list, current_list[sorting_index+1].index, sorting_index + 1, end]
    else:
        current_list[end].change -= end - sorting_index-1
        current_list[end].grouping = 1
        current_list[end].highlight = 200
        current_list[sorting_index+1].change -= sorting_index+1 - end
        current_list[sorting_index + 1].grouping = 1
        current_list[sorting_index+1].highlight = 200
        current_list[sorting_index+1], current_list[end] = current_list[end], current_list[
            sorting_index+1]
        return [current_list, current_list[sorting_index].index, sorting_index, end-1]

def quicksort_to_end_as_lists(lst: List[Node]) -> List:
    first_in_list = []
    result_in_lists = []
    for node in lst:
        result_in_lists.append(node.returnAsList())
        node.change = 0
    first_in_list.append(result_in_lists)
    first_in_list.append(0)
    first_in_list.append(0)
    first_in_list.append(len(lst) - 1)
    result = []
    result.append(first_in_list)
    result.extend(quicksort_recursion(lst, 0, len(lst) - 1))
    return result
    

def quicksort_recursion(current_list: List[Node], start: int, end: int) -> List:
    result = []
    index = start
    new_end = end
    full_list = []
    if index >= end:
        # result_in_lists = []
        # for node in current_list:
        #     result_in_lists.append(node.returnAsList())
        #     node.change = 0
        #     node.grouping = 0
        # return [[result_in_lists, index, start, end]]
        return []
    while index < new_end:
        full_list = quicksort(current_list, index, new_end)
        one_iteration_result = []
        result_in_lists = []
        for node in current_list:
            result_in_lists.append(node.returnAsList())
            node.change = 0
            node.highlight = -1
        one_iteration_result.append(result_in_lists)
        one_iteration_result.append(full_list[1])
        one_iteration_result.append(start)
        one_iteration_result.append(end)
        result.append(one_iteration_result)
        index = full_list[2]
        new_end = full_list[3]
    result.extend(quicksort_recursion(current_list, start, index-1))
    result.extend(quicksort_recursion(current_list, index+1, end))
    return result


if __name__ == '__main__':
    listof100init = list(range(4))
    listof100 = []
    random.shuffle(listof100init)
    for index in range(len(listof100init)):
        listof100.append(Node(index, listof100init[index], 0, 0))
    # send it!
    sortedList = quicksort_to_end_as_lists(listof100)
    for x in sortedList:
        print(x)
