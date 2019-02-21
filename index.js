#!/usr/bin/env node

const path = require('path')
const rimraf = require('rimraf')
const glob = require('glob')

const { convertArticle } = require('./convertArticle')

const baseSrcDir = path.resolve(process.cwd(), 'note/')
const globPath = path.resolve(baseSrcDir, 'markdown/**/**.md')

const mdFiles = glob.sync(globPath)
const exportDir = path.resolve(baseSrcDir, 'json')
const summaryFilePath = path.resolve(baseSrcDir, 'json', '_summary.json')
const fileMapFilePath = path.resolve(baseSrcDir, 'json', '_filemap.json')

rimraf.sync(exportDir)
convertArticle(mdFiles, exportDir, summaryFilePath, fileMapFilePath)
