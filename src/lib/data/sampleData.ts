import type { Subject, Question, DiscussionPost } from '../types';

// Sample Subjects
export const sampleSubjects: Subject[] = [
	{
		id: 'matematika',
		name: 'Matematika',
		description: 'Pelajari konsep matematika dengan cara yang menyenangkan',
		icon: '📐',
		color: '#3B82F6',
		totalQuestions: 50,
		completedQuestions: 0
	},
	{
		id: 'fisika',
		name: 'Fisika',
		description: 'Eksplorasi hukum-hukum alam melalui soal-soal interaktif',
		icon: '⚛️',
		color: '#10B981',
		totalQuestions: 45,
		completedQuestions: 0
	},
	{
		id: 'kimia',
		name: 'Kimia',
		description: 'Pahami reaksi kimia dan struktur molekul',
		icon: '🧪',
		color: '#F59E0B',
		totalQuestions: 40,
		completedQuestions: 0
	},
	{
		id: 'biologi',
		name: 'Biologi',
		description: 'Jelajahi kehidupan dan sistem biologis',
		icon: '🧬',
		color: '#8B5CF6',
		totalQuestions: 55,
		completedQuestions: 0
	},
	{
		id: 'bahasa-indonesia',
		name: 'Bahasa Indonesia',
		description: 'Tingkatkan kemampuan berbahasa Indonesia',
		icon: '📚',
		color: '#EF4444',
		totalQuestions: 35,
		completedQuestions: 0
	},
	{
		id: 'bahasa-inggris',
		name: 'Bahasa Inggris',
		description: 'Master English language skills',
		icon: '🌍',
		color: '#06B6D4',
		totalQuestions: 60,
		completedQuestions: 0
	},
	{
		id: 'ips',
		name: 'Ilmu Pengetahuan Sosial',
		description: 'Pelajari sejarah, geografi, dan ilmu sosial lainnya',
		icon: '🏛️',
		color: '#F97316',
		totalQuestions: 40,
		completedQuestions: 0
	},
	{
		id: 'ipa',
		name: 'Ilmu Pengetahuan Alam',
		description: 'Pelajari konsep dasar sains dan eksperimen',
		icon: '🔬',
		color: '#8B5CF6',
		totalQuestions: 45,
		completedQuestions: 0
	}
];

// Sample Questions for Matematika
export const sampleMathQuestions: Question[] = [
	{
		id: 'math-1',
		subjectId: 'matematika',
		level: 1,
		type: 'multiple_choice',
		question: 'Berapa hasil dari 15 + 28?',
		options: ['41', '42', '43', '44'],
		correctAnswer: 2,
		explanation: 'Jawaban yang benar adalah 43. Karena 15 + 28 = 43',
		basePoints: 10,
		timeLimit: 30,
		difficulty: 'easy'
	},
	{
		id: 'math-2',
		subjectId: 'matematika',
		level: 1,
		type: 'fill_blank',
		question: 'Jika x = 5, maka nilai dari 3x + 2 = ____',
		correctAnswer: '17',
		explanation: 'Substitusi x = 5 ke dalam 3x + 2: 3(5) + 2 = 15 + 2 = 17',
		basePoints: 15,
		timeLimit: 45,
		difficulty: 'easy',
		hints: ['Substitusikan nilai x terlebih dahulu', 'Hitung perkalian sebelum penjumlahan']
	},
	{
		id: 'math-3',
		subjectId: 'matematika',
		level: 2,
		type: 'multiple_choice',
		question: 'Berapa akar dari 144?',
		options: ['11', '12', '13', '14'],
		correctAnswer: 1,
		explanation: 'Akar dari 144 adalah 12, karena 12 × 12 = 144',
		basePoints: 20,
		timeLimit: 30,
		difficulty: 'medium'
	},
	{
		id: 'math-4',
		subjectId: 'matematika',
		level: 2,
		type: 'fill_blank',
		question: 'Luas lingkaran dengan jari-jari 7 cm adalah ____ cm² (π = 22/7)',
		correctAnswer: '154',
		explanation: 'Luas = π × r² = 22/7 × 7² = 22/7 × 49 = 154 cm²',
		basePoints: 25,
		timeLimit: 60,
		difficulty: 'medium',
		hints: ['Gunakan rumus Luas = π × r²', 'Jari-jari = 7, maka r² = 49']
	},
	{
		id: 'math-5',
		subjectId: 'matematika',
		level: 3,
		type: 'multiple_choice',
		question: 'Turunan dari f(x) = 3x² + 2x - 1 adalah...',
		options: ['6x + 2', '6x - 2', '3x + 2', '6x + 1'],
		correctAnswer: 0,
		explanation: 'f\'(x) = d/dx(3x²) + d/dx(2x) - d/dx(1) = 6x + 2 - 0 = 6x + 2',
		basePoints: 30,
		timeLimit: 90,
		difficulty: 'hard'
	},
	{
		id: 'math-6',
		subjectId: 'matematika',
		level: 1,
		type: 'true_false',
		question: 'Hasil dari 5 × 6 + 4 = 34',
		options: ['Benar', 'Salah'],
		correctAnswer: 0,
		explanation: 'Benar, karena 5 × 6 + 4 = 30 + 4 = 34',
		basePoints: 10,
		timeLimit: 20,
		difficulty: 'easy'
	}
];

// Sample Questions for Fisika
export const samplePhysicsQuestions: Question[] = [
	{
		id: 'physics-1',
		subjectId: 'fisika',
		level: 1,
		type: 'multiple_choice',
		question: 'Satuan kecepatan dalam SI adalah...',
		options: ['m/s', 'km/h', 'cm/s', 'mil/h'],
		correctAnswer: 0,
		explanation: 'Satuan kecepatan dalam sistem SI adalah meter per sekon (m/s)',
		basePoints: 10,
		timeLimit: 30,
		difficulty: 'easy'
	},
	{
		id: 'physics-2',
		subjectId: 'fisika',
		level: 1,
		type: 'fill_blank',
		question: 'Hukum Newton I menyatakan bahwa benda akan tetap ____ atau bergerak lurus beraturan jika resultan gaya = 0',
		correctAnswer: 'diam',
		explanation: 'Hukum Newton I (Hukum Kelembaman) menyatakan bahwa benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya yang bekerja = 0',
		basePoints: 15,
		timeLimit: 45,
		difficulty: 'easy',
		hints: ['Pikirkan tentang keadaan benda sebelum bergerak', 'Kata yang berlawanan dengan bergerak']
	},
	{
		id: 'physics-3',
		subjectId: 'fisika',
		level: 2,
		type: 'multiple_choice',
		question: 'Sebuah benda bergerak dengan kecepatan 20 m/s, kemudian mengalami perlambatan 4 m/s². Jarak yang ditempuh hingga berhenti adalah...',
		options: ['50 m', '60 m', '40 m', '80 m'],
		correctAnswer: 0,
		explanation: 'Menggunakan rumus v² = v₀² + 2as, dimana v = 0, v₀ = 20 m/s, a = -4 m/s². Maka: 0 = 400 - 8s, s = 50 m',
		basePoints: 25,
		timeLimit: 90,
		difficulty: 'medium'
	},
	{
		id: 'physics-4',
		subjectId: 'fisika',
		level: 2,
		type: 'true_false',
		question: 'Energi kinetik berbanding lurus dengan massa dan kuadrat kecepatan',
		options: ['Benar', 'Salah'],
		correctAnswer: 0,
		explanation: 'Benar. Rumus energi kinetik adalah Ek = ½mv², dimana m adalah massa dan v adalah kecepatan',
		basePoints: 20,
		timeLimit: 30,
		difficulty: 'medium'
	}
];

// Sample Questions for other subjects (simplified)
export const sampleQuestionsBySubject = {
	matematika: sampleMathQuestions,
	fisika: samplePhysicsQuestions,
	kimia: [
		{
			id: 'chem-1',
			subjectId: 'kimia',
			level: 1,
			type: 'multiple_choice',
			question: 'Rumus kimia air adalah...',
			options: ['H2O', 'CO2', 'NaCl', 'CH4'],
			correctAnswer: 0,
			explanation: 'Air memiliki rumus kimia H2O (2 atom hidrogen + 1 atom oksigen)',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'chem-2',
			subjectId: 'kimia',
			level: 2,
			type: 'fill_blank',
			question: 'Unsur dengan nomor atom 6 adalah ____',
			correctAnswer: 'Karbon',
			explanation: 'Unsur dengan nomor atom 6 adalah Karbon (C)',
			basePoints: 15,
			timeLimit: 45,
			difficulty: 'medium',
			hints: ['Lihat tabel periodik', 'Unsur ini adalah dasar kehidupan organik']
		}
	],
	biologi: [
		{
			id: 'bio-1',
			subjectId: 'biologi',
			level: 1,
			type: 'multiple_choice',
			question: 'Organel sel yang berfungsi sebagai pusat kontrol sel adalah...',
			options: ['Mitokondria', 'Nucleus', 'Ribosom', 'Vakuola'],
			correctAnswer: 1,
			explanation: 'Nucleus (inti sel) berfungsi sebagai pusat kontrol sel yang mengatur semua aktivitas sel',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'bio-2',
			subjectId: 'biologi',
			level: 1,
			type: 'true_false',
			question: 'Fotosintesis hanya terjadi pada siang hari',
			options: ['Benar', 'Salah'],
			correctAnswer: 0,
			explanation: 'Benar. Fotosintesis memerlukan cahaya matahari, sehingga hanya terjadi pada siang hari',
			basePoints: 10,
			timeLimit: 25,
			difficulty: 'easy'
		}
	],
	'bahasa-indonesia': [
		{
			id: 'indo-1',
			subjectId: 'bahasa-indonesia',
			level: 1,
			type: 'multiple_choice',
			question: 'Kata yang termasuk kata benda adalah...',
			options: ['Berlari', 'Meja', 'Indah', 'Dengan'],
			correctAnswer: 1,
			explanation: 'Meja adalah kata benda (nomina) yang menunjukkan nama suatu benda',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'indo-2',
			subjectId: 'bahasa-indonesia',
			level: 2,
			type: 'fill_blank',
			question: 'Kalimat "Ibu memasak di dapur" memiliki pola S-P-____',
			correctAnswer: 'K',
			explanation: 'Pola kalimat adalah S-P-K (Subjek-Predikat-Keterangan). "di dapur" adalah keterangan tempat',
			basePoints: 15,
			timeLimit: 45,
			difficulty: 'medium',
			hints: ['S = Subjek, P = Predikat, ? = Keterangan', 'Di dapur menunjukkan tempat']
		}
	],
	'bahasa-inggris': [
		{
			id: 'eng-1',
			subjectId: 'bahasa-inggris',
			level: 1,
			type: 'multiple_choice',
			question: 'What is the past tense of "go"?',
			options: ['Goed', 'Went', 'Gone', 'Going'],
			correctAnswer: 1,
			explanation: 'The past tense of "go" is "went"',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'eng-2',
			subjectId: 'bahasa-inggris',
			level: 2,
			type: 'fill_blank',
			question: 'I ____ been to London before. (Present Perfect)',
			correctAnswer: 'have',
			explanation: 'Present Perfect tense menggunakan "have/has + past participle". Karena subjek "I", maka menggunakan "have"',
			basePoints: 15,
			timeLimit: 45,
			difficulty: 'medium',
			hints: ['Present Perfect = have/has + V3', 'Subjek "I" menggunakan "have"']
		},
		{
			id: 'eng-3',
			subjectId: 'bahasa-inggris',
			level: 1,
			type: 'multiple_choice',
			question: 'Which sentence is in Present Simple tense?',
			options: ['I am studying', 'I studied', 'I study', 'I will study'],
			correctAnswer: 2,
			explanation: '"I study" is in Present Simple tense. It expresses a habit or general truth.',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'eng-4',
			subjectId: 'bahasa-inggris',
			level: 2,
			type: 'true_false',
			question: 'In Future Simple tense, we use "will" + base verb',
			options: ['True', 'False'],
			correctAnswer: 0,
			explanation: 'True. Future Simple tense structure is: Subject + will + base verb',
			basePoints: 10,
			timeLimit: 25,
			difficulty: 'medium'
		}
	],
	'ipa': [
		{
			id: 'ipa-1',
			subjectId: 'ipa',
			level: 1,
			type: 'multiple_choice',
			question: 'Apa yang dimaksud dengan produsen dalam ekosistem?',
			options: ['Makhluk hidup yang memakan tumbuhan', 'Tumbuhan hijau yang membuat makanan sendiri', 'Makhluk hidup yang memakan daging', 'Makhluk hidup yang menguraikan sisa makhluk hidup'],
			correctAnswer: 1,
			explanation: 'Produsen adalah tumbuhan hijau yang membuat makanan sendiri melalui fotosintesis',
			basePoints: 10,
			timeLimit: 30,
			difficulty: 'easy'
		},
		{
			id: 'ipa-2',
			subjectId: 'ipa',
			level: 2,
			type: 'fill_blank',
			question: 'Satuan gaya dalam SI adalah ____',
			correctAnswer: 'Newton',
			explanation: 'Satuan gaya dalam Sistem Internasional (SI) adalah Newton (N)',
			basePoints: 15,
			timeLimit: 45,
			difficulty: 'medium',
			hints: ['Satuan ini diambil dari nama seorang ilmuwan', 'Dilambangkan dengan huruf N']
		},
		{
			id: 'ipa-3',
			subjectId: 'ipa',
			level: 1,
			type: 'true_false',
			question: 'Hukum III Newton menyatakan bahwa aksi sama dengan reaksi',
			options: ['Benar', 'Salah'],
			correctAnswer: 0,
			explanation: 'Benar. Hukum III Newton menyatakan bahwa setiap aksi memiliki reaksi yang sama besar dan berlawanan arah',
			basePoints: 10,
			timeLimit: 25,
			difficulty: 'easy'
		}
	]
};

// Sample Discussion Posts
export const sampleDiscussions: DiscussionPost[] = [
	{
		id: 'disc-1',
		userId: 'user-1',
		userName: 'Andi Pratama',
		userAvatar: 'student-1',
		subjectId: 'matematika',
		title: 'Cara mudah mengingat rumus turunan?',
		content: 'Halo teman-teman! Ada yang punya tips untuk mengingat rumus-rumus turunan? Saya sering lupa rumus turunan fungsi trigonometri. Terima kasih!',
		likes: 5,
		dislikes: 0,
		replies: [
			{
				id: 'reply-1',
				userId: 'user-2',
				userName: 'Sari Indah',
				userAvatar: 'student-2',
				postId: 'disc-1',
				content: 'Coba buat catatan kecil yang bisa dibawa kemana-mana. Rumus turunan sin x = cos x, cos x = -sin x. Latihan terus ya!',
				likes: 3,
				dislikes: 0,
				createdAt: new Date('2024-01-15T10:30:00')
			}
		],
		createdAt: new Date('2024-01-15T09:15:00'),
		updatedAt: new Date('2024-01-15T10:30:00')
	},
	{
		id: 'disc-2',
		userId: 'user-3',
		userName: 'Budi Santoso',
		userAvatar: 'student-3',
		subjectId: 'fisika',
		title: 'Perbedaan kecepatan dan kelajuan',
		content: 'Masih bingung nih, apa sih perbedaan antara kecepatan dan kelajuan? Kapan kita pakai yang mana?',
		likes: 8,
		dislikes: 1,
		replies: [
			{
				id: 'reply-2',
				userId: 'user-4',
				userName: 'Maya Sari',
				userAvatar: 'student-4',
				postId: 'disc-2',
				content: 'Kelajuan itu besaran skalar (hanya nilai), sedangkan kecepatan itu besaran vektor (ada arah). Contoh: mobil melaju 60 km/jam (kelajuan), mobil melaju 60 km/jam ke arah utara (kecepatan).',
				likes: 6,
				dislikes: 0,
				createdAt: new Date('2024-01-14T14:20:00')
			},
			{
				id: 'reply-3',
				userId: 'user-5',
				userName: 'Doni Wijaya',
				userAvatar: 'student-5',
				postId: 'disc-2',
				content: 'Tambahan: kelajuan selalu positif, tapi kecepatan bisa negatif (tergantung arah yang kita tentukan sebagai positif).',
				likes: 4,
				dislikes: 0,
				createdAt: new Date('2024-01-14T15:10:00')
			}
		],
		createdAt: new Date('2024-01-14T13:45:00'),
		updatedAt: new Date('2024-01-14T15:10:00')
	},
	{
		id: 'disc-3',
		userId: 'user-6',
		userName: 'Lina Kartika',
		userAvatar: 'student-6',
		subjectId: 'kimia',
		title: 'Cara menghafal tabel periodik',
		content: 'Ada trik khusus gak buat ngafalin tabel periodik? Terutama untuk unsur-unsur golongan utama.',
		likes: 12,
		dislikes: 0,
		replies: [],
		createdAt: new Date('2024-01-13T16:30:00'),
		updatedAt: new Date('2024-01-13T16:30:00')
	}
];

// Initialize data function
export function initializeSampleData() {
	if (typeof window !== 'undefined') {
		// Initialize subjects if not exists
		if (!localStorage.getItem('edu-ruang-subjects')) {
			localStorage.setItem('edu-ruang-subjects', JSON.stringify(sampleSubjects));
		}

		// Initialize questions if not exists
		if (!localStorage.getItem('edu-ruang-questions')) {
			localStorage.setItem('edu-ruang-questions', JSON.stringify(sampleQuestionsBySubject));
		}

		// Initialize discussions if not exists
		if (!localStorage.getItem('edu-ruang-discussions')) {
			// Convert Date objects to strings for localStorage
			const discussionsToStore = sampleDiscussions.map(discussion => ({
				...discussion,
				createdAt: discussion.createdAt.toISOString(),
				updatedAt: discussion.updatedAt.toISOString(),
				replies: discussion.replies.map(reply => ({
					...reply,
					createdAt: reply.createdAt.toISOString()
				}))
			}));
			localStorage.setItem('edu-ruang-discussions', JSON.stringify(discussionsToStore));
		}
	}
}