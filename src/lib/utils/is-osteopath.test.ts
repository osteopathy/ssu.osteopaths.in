// sum.test.js
import { expect, test } from 'vitest'
import { isOsteopath, parseSSUEmail } from './is-osteopath'

test('Extract Batch, Year from Sri Sri University Gmail', () => {
  expect(parseSSUEmail('sukhpreet.s2021btcseai@srisriuniversity.edu.in')).toMatchObject({
    name: 'sukhpreet',
    meta: 's2021btcseai',
    year: 2021,
    batch: 'btcseai',
  });
  expect(parseSSUEmail("kushagre.d2018ios@srisriuniversity.edu.in")).toMatchObject({
    name: 'kushagre',
    meta: 'd2018ios',
    year: 2018,
    batch: 'ios',
  })
  expect(parseSSUEmail("kushagre.d2018ios@srisriuniversity.edu.in")).toMatchObject({
    name: 'kushagre',
    meta: 'd2018ios',
    year: 2018,
    batch: 'ios',
  })
  expect(parseSSUEmail("narayani.c2021mos@srisriuniversity.edu.in")).toMatchObject({
    name: 'narayani',
    meta: 'c2021mos',
    year: 2021,
    batch: 'mos',
  })
  expect(parseSSUEmail("rajas.c2022bos@srisriuniversity.edu.in")).toMatchObject({
    name: 'rajas',
    meta: 'c2022bos',
    year: 2022,
    batch: 'bos',
  })
  expect(parseSSUEmail("sukhpreetben10@gmail.com")).toBeUndefined()
})

test('Is Osteopath', () => {
  expect(isOsteopath("sukhpreetben10@gmail.com")).toBeFalsy()

  expect(isOsteopath('sukhpreet.s2021btcseai@srisriuniversity.edu.in')).toBeFalsy()
  expect(isOsteopath('aryan.d2023bba@srisriuniversity.edu.in')).toBeFalsy()
  expect(isOsteopath('gayatri.s2018baenglish@srisriuniversity.edu.in')).toBeFalsy()

  expect(isOsteopath("kushagre.d2018ios@srisriuniversity.edu.in")).toBe('ios')
  expect(isOsteopath("narayani.c2021mos@srisriuniversity.edu.in")).toBe('mos')
  expect(isOsteopath("rishi.s2022mos@srisriuniversity.edu.in")).toBe('mos')
  expect(isOsteopath("rajas.c2022bos@srisriuniversity.edu.in")).toBe('bos')
})
