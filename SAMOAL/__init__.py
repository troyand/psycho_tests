# -*- coding: utf-8 -*-

if __name__ == '__main__':
    import re, codecs
    questions = {}
    with codecs.open('questions.txt', encoding='utf-8') as questions_file:
        for question_number, question_variants in re.findall(
                u'(\d+)\.(\D+)', questions_file.read()):
            qn = int(question_number)
            questions[qn] = {}
            for letter, question_text in re.findall(
                    u'(\D)\) (.*)\.', question_variants):
#remove some bizzare character from the original text file
                questions[qn][letter] = question_text.replace(u'\xad', '')

    answers = {}
    with codecs.open('answers.txt', encoding='utf-8') as answers_file:
        for question_number, variant in re.findall(
                u'(\d+)(\D)', answers_file.read()):
            answers[int(question_number)] = variant.lower()

    user_answers = {}

    for question_number in questions:
        print str(question_number).center(80)
        if len(questions[question_number]) != 2:
            raise Exception('Question %i has bad variants' % question_number)
        for letter in sorted(questions[question_number].keys()):
            print letter, ')', questions[question_number][letter]

        ans = None
        while ans not in questions[question_number].keys():
            print u'Відповідь - ? '
            raw = raw_input()
            ans = raw.decode('utf-8')
        user_answers[question_number] = ans

        if question_number > 3:
            break

    for question_number in user_answers:
        if user_answers[question_number] == answers[question_number]:
            res = '[+]'
        else:
            res = '[-]'
        print question_number, ':', res,
        print questions[question_number][user_answers[question_number]]

