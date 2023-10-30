const dictionary = {
    '010000': 'P',
    '110000':'0',

    '000001':'A',
    '010001': 'Q',
    '110001':'1',

    '000010':'B',
    '010010': 'R',
    '110010':'2',

    '000011':'C',
    '010011': 'S',
    '110011':'3',

    '000100':'D',
    '010100': 'T',
    '110100':'4',

    '000101':'E',
    '010101': 'U',
    '110101':'5',

    '000110':'F',
    '010110': 'V',
    '110110':'6',

    '000111':'G',
    '010111': 'W',
    '110111':'7',

    '001000':'H',
    '011000': 'X',
    '111000':'8',

    '001001':'I',
    '011001': 'Y',
    '111001':'9',

    '001010':'J',
    '011010': 'Z',

    '001011':'K',

    '001100':'L',

    '001101':'M',

    '001110':'N',

    '001111':'O',
};

export function processID(buffer: Uint8Array) :string {

    // Convertir los bytes en grupos de 6 bits
    const bits = [];
    for (const b of buffer.slice(0, 6)){
        bits.push(b.toString(2).padStart(8, '0'))
    }

    const bitsstream = bits.join('')

    const bitGroups = [];
    for (let i = 0; i < bitsstream.length; i += 6) {
        bitGroups.push(bitsstream.slice(i, i + 6));
    }

    // Mapear los grupos de bits a caracteres usando el diccionario
    const characters = bitGroups.map(group => dictionary[group] || '');

    return characters.join('');
}