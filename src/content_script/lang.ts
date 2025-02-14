/* eslint-disable no-control-regex */
/* eslint-disable no-misleading-character-class */

import { isTraditional } from '../common/traditional-or-simplified'
import ISO6391 from 'iso-639-1'
import { invoke } from '@tauri-apps/api/tauri'
import { isDesktopApp } from '../common/utils'

export const supportLanguages: [string, string][] = [
    // ['auto', 'auto'],
    ['en', 'English'],
    // ['zh', '中文'],
    ['zh-Hans', '简体中文'],
    ['zh-Hant', '繁體中文'],
    ['yue', '粤语'],
    ['wyw', '古文'],
    ['ja', '日本語'],
    ['ko', '한국어'],
    ['fr', 'Français'],
    ['de', 'Deutsch'],
    ['es', 'Español'],
    ['it', 'Italiano'],
    ['ru', 'Русский'],
    ['pt', 'Português'],
    ['nl', 'Nederlands'],
    ['pl', 'Polski'],
    ['ar', 'العربية'],
    ['af', 'Afrikaans'],
    ['am', 'አማርኛ'],
    ['az', 'Azərbaycan'],
    ['be', 'Беларуская'],
    ['bg', 'Български'],
    ['bn', 'বাংলা'],
    ['bs', 'Bosanski'],
    ['ca', 'Català'],
    ['ceb', 'Cebuano'],
    ['co', 'Corsu'],
    ['cs', 'Čeština'],
    ['cy', 'Cymraeg'],
    ['da', 'Dansk'],
    ['el', 'Ελληνικά'],
    ['eo', 'Esperanto'],
    ['et', 'Eesti'],
    ['eu', 'Euskara'],
    ['fa', 'فارسی'],
    ['fi', 'Suomi'],
    ['fj', 'Fijian'],
    ['fy', 'Frysk'],
    ['ga', 'Gaeilge'],
    ['gd', 'Gàidhlig'],
    ['gl', 'Galego'],
    ['gu', 'ગુજરાતી'],
    ['ha', 'Hausa'],
    ['haw', 'Hawaiʻi'],
    ['he', 'עברית'],
    ['hi', 'हिन्दी'],
    ['hmn', 'Hmong'],
    ['hr', 'Hrvatski'],
    ['ht', 'Kreyòl Ayisyen'],
    ['hu', 'Magyar'],
    ['hy', 'Հայերեն'],
    ['id', 'Bahasa Indonesia'],
    ['ig', 'Igbo'],
    ['is', 'Íslenska'],
    ['jw', 'Jawa'],
    ['ka', 'ქართული'],
    ['kk', 'Қазақ'],
    ['mn', 'Монгол хэл'],
    ['tr', 'Türkçe'],
    ['ug', 'ئۇيغۇر تىلى'],
    ['ur', 'اردو'],
    ['vi', 'Tiếng Việt'],
]

export const langMap: Map<string, string> = new Map(supportLanguages)
export const langMapReverse = new Map(supportLanguages.map(([standardLang, lang]) => [lang, standardLang]))

export async function detectLang(text: string): Promise<string | null> {
    const lang = await _detectLang(text)
    if (lang === 'zh' || lang === 'zh-CN' || lang === 'zh-TW') {
        return isTraditional(text) ? 'zh-Hant' : 'zh-Hans'
    }
    return lang
}

export async function _detectLang(text: string): Promise<string | null> {
    const detectedText = text.trim()
    return new Promise((resolve) => {
        if (isDesktopApp()) {
            invoke('detect_lang', { text: detectedText }).then((lang) => {
                if (!lang) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const langName = (window as any).detectLanguage(detectedText)
                    const langCode = ISO6391.getCode(langName)
                    resolve(langCode)
                } else {
                    resolve(lang as string)
                }
            })
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const langName = (window as any).detectLanguage(detectedText)
            const langCode = ISO6391.getCode(langName)
            resolve(langCode)
        }
    })
}
