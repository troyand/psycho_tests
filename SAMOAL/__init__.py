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
                questions[qn][letter] = question_text.replace(u'\xad', '')+'.'

    import json
    with codecs.open('questions.json', 'w', encoding='utf-8') as q_json:
        json.dump(questions, q_json, indent=2, ensure_ascii=False)

    answers = {}
    with codecs.open('answers.txt', encoding='utf-8') as answers_file:
        for question_number, variant in re.findall(
                u'(\d+)(\D)', answers_file.read()):
            answers[int(question_number)] = variant.lower()

    with codecs.open('answers.json', 'w', encoding='utf-8') as a_json:
        json.dump(answers, a_json, indent=2, ensure_ascii=False)

    field_answers = {}
    with codecs.open('fields.txt', encoding='utf-8') as fields_file:
        for line in fields_file:
            field, csv = re.findall(u'\d+\. (.*):(.*)\.', line)[0]
            field_answers[field] = {}
            for question_number, variant in re.findall(u'(\d+)(\D)', csv):
                field_answers[field][int(question_number)] = variant
#            print field, field_answers[field]

    with codecs.open('field_answers.json', 'w', encoding='utf-8') as f_json:
        json.dump(field_answers, f_json, indent=2, ensure_ascii=False)

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

    positive_answers_count = 0
    positive_field_answers_count = {}
    for field in field_answers:
        positive_field_answers_count[field] = 0

    for question_number in user_answers:
        if user_answers[question_number] == answers[question_number]:
            res = u'[+]'
            positive_answers_count += 1
        else:
            res = u'[-]'
        question_fields = ''
        for field in field_answers:
            if user_answers[question_number] == field_answers[field].get(
                    question_number):
                question_fields += field + ' '
                positive_field_answers_count[field] += 1

        print question_number, ':', res,
        print questions[question_number][user_answers[question_number]]
        if question_fields != '':
            print question_fields

    print u'Результати'.center(80)
    print u'Загальна оцінка - %i %%' % (100 * positive_answers_count /
            len(questions.items()))
    for field in field_answers:
        print field, '- %i %%' % (100 *
                positive_field_answers_count[field] /
                len(field_answers[field].items()))

