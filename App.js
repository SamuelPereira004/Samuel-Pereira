import { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Pressable,
  Image
} from "react-native";

import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import AssetExample from "./components/AssetExample";

async function salvarXP(valor) {
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { xp: { integerValue: valor } } })
    }
  );
}

async function salvarStreak(valor) {
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { streak: { integerValue: valor } } })
    }
  );
}

async function salvarMissoes(lista) {
  const camposMissoes = lista.map((m) => ({
    mapValue: {
      fields: {
        titulo: { stringValue: m.titulo },
        xp: { integerValue: m.xp },
        feita: { booleanValue: m.feita }
      }
    }
  }));
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { missoes: { arrayValue: { values: camposMissoes } } } })
    }
  );
}

async function salvarMapa(mapa) {
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          mapaPessoal: {
            mapValue: {
              fields: {
                mente: { integerValue: mapa.mente },
                corpo: { integerValue: mapa.corpo },
                aparencia: { integerValue: mapa.aparencia },
                comunicacao: { integerValue: mapa.comunicacao },
                carreira: { integerValue: mapa.carreira },
                financas: { integerValue: mapa.financas }
              }
            }
          }
        }
      })
    }
  );
}
function obterSaudacao() {
  const hora = new Date().getHours();

  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";

  return "Boa noite";
}
function BotaoSSS({
  texto,
  onPress,
  cor = "#16A34A",
  desabilitado = false,
}) {
  return (
    <Pressable
      onPress={desabilitado ? null : onPress}
      style={[
        styles.botaoContainer,
        { backgroundColor: cor },
        desabilitado && { opacity: 0.45 },
      ]}
    >
      <Text style={styles.botaoTexto}>{texto}</Text>
    </Pressable>
  );
}
async function salvarNome(valor) {
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { nome: { stringValue: valor } } })
    }
  );
}
async function salvarAlvoDoDia(alvo, concluido = false) {
  await fetch(
    'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          alvoDoDia: { stringValue: alvo },
          alvoConcluido: { booleanValue: concluido }
        }
      })
    }
  );
}
async function salvarFotoPerfil(uri) {
  await fetch(
    "https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1",
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          fotoPerfil: {
            stringValue: uri
          }
        }
      })
    }
  );
}
const niveis = [
  { nome: "RECRUTA", minimo: 0 },
  { nome: "COMBATENTE", minimo: 100 },
  { nome: "SOLDADO", minimo: 250 },
  { nome: "GUERREIRO", minimo: 500 },
  { nome: "COMANDANTE", minimo: 800 },
  { nome: "LENDÁRIO", minimo: 1200 },
];

export default function App() {
  const [cumprida, setCumprida] = useState(false);
  const [xp, setXp] = useState(0);
  const [telaAtual, setTelaAtual] = useState("dashboard");
  const [streak, setStreak] = useState(0);
  const [missoes, setMissoes] = useState([
    { titulo: "Definir alvo do dia", xp: 10, feita: false },
    { titulo: "Missão de reforço", xp: 25, feita: false },
  ]);
  const [mapaPessoal, setMapaPessoal] = useState({
    mente: 60, corpo: 45, aparencia: 70, comunicacao: 55, carreira: 80, financas: 30,
  });
 const [nome, setNome] = useState("");
 const [fotoPerfil, setFotoPerfil] = useState(null);
 
function obterNivel(xpAtual) {
  let indice = 0;

  niveis.forEach((n, i) => {
    if (xpAtual >= n.minimo) {
      indice = i;
    }
  });

  return {
    nome: niveis[indice].nome,
    nivel: indice + 1,
    minimo: niveis[indice].minimo,
    proximo:
      indice < niveis.length - 1
        ? niveis[indice + 1].minimo
        : niveis[indice].minimo,
  };
}
const [alvoDoDia, setAlvoDoDia] = useState("");
const [alvoConcluido, setAlvoConcluido] = useState(false);
  async function carregarDados() {
    const resposta = await fetch(
      'https://firestore.googleapis.com/v1/projects/sss-app-a266c/databases/(default)/documents/usuarios/usuario1'
    );
    const dados = await resposta.json();
    if (dados.fields) {
      if (dados.fields.xp) { setXp(parseInt(dados.fields.xp.integerValue)); }
      if (dados.fields.streak) { setStreak(parseInt(dados.fields.streak.integerValue)); }
      if (dados.fields.missoes) {
        const missoesCarregadas = dados.fields.missoes.arrayValue.values.map((m) => ({
          titulo: m.mapValue.fields.titulo.stringValue,
          xp: parseInt(m.mapValue.fields.xp.integerValue),
          feita: m.mapValue.fields.feita.booleanValue
        }));
        setMissoes(missoesCarregadas);
      }
      if (dados.fields.mapaPessoal) {
        const m = dados.fields.mapaPessoal.mapValue.fields;
        setMapaPessoal({
          mente: parseInt(m.mente.integerValue),
          corpo: parseInt(m.corpo.integerValue),
          aparencia: parseInt(m.aparencia.integerValue),
          comunicacao: parseInt(m.comunicacao.integerValue),
          carreira: parseInt(m.carreira.integerValue),
          financas: parseInt(m.financas.integerValue)
        });
      }
      if (dados.fields.nome) { setNome(dados.fields.nome.stringValue); }
    }
    if (dados.fields.fotoPerfil) {
  setFotoPerfil(dados.fields.fotoPerfil.stringValue);
}
    if (dados.fields.alvoDoDia) {
  setAlvoDoDia(dados.fields.alvoDoDia.stringValue);
}

if (dados.fields.alvoConcluido) {
  setAlvoConcluido(dados.fields.alvoConcluido.booleanValue);
}
  }

  useEffect(() => {
    carregarDados();
  }, []);
async function escolherFoto() {
  const permissao =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    alert("Permita acesso à galeria.");
    return;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

if (!resultado.canceled) {
  const uri = resultado.assets[0].uri;

  const response = await fetch(uri);
  const blob = await response.blob();

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64 = reader.result;

    setFotoPerfil(base64);
    salvarFotoPerfil(base64);
  };

  reader.readAsDataURL(blob);
}
}
  return (
    <View style={styles.container}>
      {telaAtual === "dashboard" && (
        <>
     <View style={styles.header}>
  <View style={{ flex: 1 }}>
    <Text style={styles.logo}>SEM RENDIÇÃO</Text>

    <Text style={styles.saudacao}>
      {obterSaudacao()},{" "}
      <Text style={styles.nomeUsuario}>
        {nome || "Guerreiro"}
      </Text>
      .
    </Text>

    <View style={styles.dataLinha}>
      <Text style={styles.dataTexto}>
        📅 Segunda • 08 de Setembro
      </Text>
    </View>
  </View>

  <Pressable
    style={styles.avatarContainer}
    onPress={escolherFoto}
  >
    <View style={styles.avatarGlow} />

    <View style={styles.avatar}>
      {fotoPerfil ? (
        <Image
          source={{ uri: fotoPerfil }}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
          }}
        />
      ) : (
        <Text style={styles.avatarTexto}>⚔️</Text>
      )}
    </View>

    <View style={styles.avatarNivel}>
      <Text style={styles.avatarNivelTexto}>1</Text>
    </View>
  </Pressable>
</View>

<View style={styles.cardProgresso}>
  <View style={styles.cardLinha}>
    <View>
      <Text style={styles.cardTitulo}>XP TOTAL</Text>
      <Text style={styles.cardValor}>{xp}</Text>
    </View>

    <View style={{ alignItems: 'flex-end' }}>
      <Text style={styles.cardTitulo}>STREAK</Text>
      <Text style={styles.cardValor}>🔥 {streak}</Text>
    </View>
  </View>

  <View style={styles.linhaSeparadora} />

  <Text style={styles.cardTitulo}>NÍVEL ATUAL</Text>
<Text style={styles.nivelTexto}>
  {obterNivel(xp).nome}
</Text>

<View style={styles.barraXpFundo}>
  <View
    style={[
      styles.barraXpPreenchimento,
      { width: `${Math.min((xp / 100) * 100, 100)}%` }
    ]}
  />
</View>

<Text style={styles.xpRestante}>
  {100 - Math.min(xp, 100)} XP para Combatente
</Text>
</View>
          <View style={styles.cardMissaoPrincipal}>
  <Text style={styles.missaoTag}>MISSÃO PRINCIPAL</Text>

  <Text style={styles.missaoTitulo}>
    Cumprir missão do dia
  </Text>

  <Text style={styles.missaoDescricao}>
    Complete a missão principal da sua jornada e ganhe 50 XP.
  </Text>
<BotaoSSS
  texto={cumprida ? "MISSÃO CUMPRIDA ✅" : "CUMPRIR MISSÃO (+50 XP)"}
  desabilitado={cumprida}
  onPress={() => {
    setCumprida(true);

    const novoXp = xp + 50;
    setXp(novoXp);
    salvarXP(novoXp);
  }}
/>
</View>
         {missoes.map((missao, index) => (
  <View key={index} style={styles.cardMissaoSecundaria}>

    <View style={styles.cardLinha}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitulo}>MISSÃO SECUNDÁRIA</Text>

        <Text style={styles.missaoSecundariaTitulo}>
          {missao.titulo}
        </Text>

        <Text style={styles.missaoXp}>
          +{missao.xp} XP
        </Text>
      </View>

      <Text style={{ fontSize: 22 }}>
        {missao.feita ? "✅" : "⚪"}
      </Text>
    </View>

    {!missao.feita && (
     <BotaoSSS
  texto="CONCLUIR MISSÃO"
  onPress={() => {
    const novaLista = [...missoes];
    novaLista[index].feita = true;

    setMissoes(novaLista);
    salvarMissoes(novaLista);

    const novoXp = xp + missao.xp;
    setXp(novoXp);
    salvarXP(novoXp);
  }}
/>
    )}

  </View>
))}
          <View style={styles.cardMissaoPrincipal}>
  <Text style={styles.missaoTag}>🎯 ALVO DO DIA</Text>

  <Text style={styles.missaoTitulo}>
    {alvoDoDia || "Nenhum alvo definido."}
  </Text>

  <Text style={styles.missaoDescricao}>
    {alvoDoDia
      ? "Sua missão principal para hoje."
      : "Defina uma missão para hoje."}
  </Text>

</View>
     <BotaoSSS
  texto="FECHAR O DIA"
  onPress={() => {
    let bonus = 5;

    if (streak >= 6 && streak < 29) {
      bonus = 10;
    }

    if (streak >= 29) {
      bonus = 20;
    }

    const novoStreak = streak + 1;
    const novoXp = xp + bonus;

    setStreak(novoStreak);
    setXp(novoXp);

    salvarStreak(novoStreak);
    salvarXP(novoXp);
  }}
/>
          <Card>
  <AssetExample />
</Card>

</>

)}

{/* BARRA DE NAVEGAÇÃO */}
<View style={styles.bottomNav}>

  <Pressable
    style={styles.navItem}
    onPress={() => setTelaAtual("dashboard")}
  >
    <Text style={[
      styles.navIcon,
      telaAtual === "dashboard" && styles.navAtivo
    ]}>
      🏠
    </Text>

    <Text style={[
      styles.navTexto,
      telaAtual === "dashboard" && styles.navAtivo
    ]}>
      Início
    </Text>
  </Pressable>

  <Pressable
    style={styles.navItem}
    onPress={() => setTelaAtual("alvo")}
  >
    <Text style={[
      styles.navIcon,
      telaAtual === "alvo" && styles.navAtivo
    ]}>
      🎯
    </Text>

    <Text style={[
      styles.navTexto,
      telaAtual === "alvo" && styles.navAtivo
    ]}>
      Missões
    </Text>
  </Pressable>

  <Pressable
    style={styles.navItem}
    onPress={() => setTelaAtual("mapa")}
  >
    <Text style={[
      styles.navIcon,
      telaAtual === "mapa" && styles.navAtivo
    ]}>
      🗺️
    </Text>

    <Text style={[
      styles.navTexto,
      telaAtual === "mapa" && styles.navAtivo
    ]}>
      Mapa
    </Text>
  </Pressable>

  <Pressable
    style={styles.navItem}
    onPress={() => setTelaAtual("avaliacao")}
  >
    <Text style={[
      styles.navIcon,
      telaAtual === "avaliacao" && styles.navAtivo
    ]}>
      🤖
    </Text>

    <Text style={[
      styles.navTexto,
      telaAtual === "avaliacao" && styles.navAtivo
    ]}>
      IA
    </Text>
  </Pressable>

  <Pressable
    style={styles.navItem}
    onPress={() => setTelaAtual("perfil")}
  >
    <Text style={[
      styles.navIcon,
      telaAtual === "perfil" && styles.navAtivo
    ]}>
      👤
    </Text>

    <Text style={[
      styles.navTexto,
      telaAtual === "perfil" && styles.navAtivo
    ]}>
      Perfil
    </Text>
  </Pressable>

</View>

{telaAtual === "perfil" && (
  <View style={styles.perfilContainer}>

  <View style={styles.perfilHeader}>

  <View style={styles.avatarContainer}>
    <View style={styles.avatarGlow} />

 <View style={styles.avatarPerfilGrande}>
  {fotoPerfil ? (
    <Image
      source={{ uri: fotoPerfil }}
      style={styles.fotoPerfilGrande}
    />
  ) : (
    <Text style={styles.avatarGrandeTexto}>⚔️</Text>
  )}
</View>

<View style={styles.avatarNivel}>
  <Text style={styles.avatarNivelTexto}>
    {obterNivel(xp).nivel}
  </Text>
</View>

<Text style={styles.perfilNome}>
  {nome || "Guerreiro"}
</Text>

<Text style={styles.perfilNivel}>
  ⚔️ {obterNivel(xp).nome}
</Text>

<Text style={styles.perfilXP}>
  {xp} XP • Nível {obterNivel(xp).nivel}
</Text>


<View style={styles.botaoFotoPerfil}>
  <BotaoSSS
    texto="ALTERAR FOTO"
    onPress={escolherFoto}
    cor="#14532D"
  />
</View>

  </View>

</View>

<View style={styles.cardPerfil}>

      <Text style={styles.cardTitulo}>PROGRESSO</Text>

      <View style={styles.barraXpFundo}>
        <View
          style={[
            styles.barraXpPreenchimento,
            { width: `${Math.min((xp / 100) * 100, 100)}%` }
          ]}
        />
      </View>

      <Text style={styles.xpRestante}>
        {100 - Math.min(xp, 100)} XP para o próximo nível.
      </Text>

    </View>

    <View style={styles.cardPerfil}>
  <Text style={styles.cardTitulo}>ESTATÍSTICAS DO GUERREIRO</Text>

  <View style={styles.statsLinha}>
    <Text style={styles.statsLabel}>XP Total</Text>
    <Text style={styles.statsValor}>{xp} XP</Text>
  </View>

  <View style={styles.statsLinha}>
    <Text style={styles.statsLabel}>Nível</Text>
    <Text style={styles.statsValor}>
      {obterNivel(xp).nivel} • {obterNivel(xp).nome}
    </Text>
  </View>

  <View style={styles.statsLinha}>
    <Text style={styles.statsLabel}>Streak</Text>
    <Text style={styles.statsValor}>🔥 {streak} dias</Text>
  </View>

  <View style={styles.statsLinha}>
    <Text style={styles.statsLabel}>Missões concluídas</Text>
    <Text style={styles.statsValor}>
      {missoes.filter((m) => m.feita).length}/{missoes.length}
    </Text>
  </View>
</View>

    <View style={styles.cardPerfil}>

      <Text style={styles.cardTitulo}>EDITAR PERFIL</Text>

      <TextInput
        style={styles.inputPerfil}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        placeholderTextColor="#64748B"
      />

      <BotaoSSS
        texto="SALVAR ALTERAÇÕES"
        onPress={() => salvarNome(nome)}
      />

      <View style={{ marginTop: 12 }}>
        <BotaoSSS
          texto="VOLTAR AO DASHBOARD"
          onPress={() => setTelaAtual("dashboard")}
        />
      </View>

    </View>

  </View>
)}
      {telaAtual === "alvo" && (
  <View>
    <Text style={styles.missaoTitulo}>🎯 Definir Alvo do Dia</Text>

    <Text style={styles.missaoDescricao}>
      Escreva a missão mais importante da sua jornada hoje.
    </Text>

    <TextInput
      style={{
        backgroundColor: '#16211A',
        color: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginVertical: 15,
      }}
      value={alvoDoDia}
      onChangeText={setAlvoDoDia}
      placeholder="Ex.: Treinar 30 minutos."
      placeholderTextColor="#777"
    />

    <Button
      title="SALVAR ALVO"
      onPress={() => {
        salvarAlvoDoDia(alvoDoDia, false);
        setAlvoConcluido(false);
        setTelaAtual("dashboard");
      }}
    />

    <View style={{ marginTop: 12 }}>
      <Button
        title="Cancelar"
        onPress={() => setTelaAtual("dashboard")}
      />
    </View>
  </View>
)}
      {telaAtual === "avaliacao" && (
        <View>
          <Text>Aqui vai a conversa de avaliação inicial com a IA (exemplo).</Text>
          <Button title="Voltar" onPress={() => setTelaAtual("dashboard")} />
        </View>
      )}
      {telaAtual === "mapa" && (
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Mapa Pessoal</Text>
          {Object.keys(mapaPessoal).map((area) => (
            <View key={area} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
              <Text style={{width: 150}}>{area}: {mapaPessoal[area]}</Text>
              <Button title="-10" onPress={() => {
                const novoMapa = {...mapaPessoal, [area]: mapaPessoal[area] - 10};
                setMapaPessoal(novoMapa);
                salvarMapa(novoMapa);
              }} />
              <Button title="+10" onPress={() => {
                const novoMapa = {...mapaPessoal, [area]: mapaPessoal[area] + 10};
                setMapaPessoal(novoMapa);
                salvarMapa(novoMapa);
              }} />
            </View>
          ))}
          <Button title="Voltar" onPress={() => setTelaAtual("dashboard")} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F0C',
    padding: 16,
  },

  logo: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },

saudacao: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '700',
  lineHeight: 28,
},

  nomeUsuario: {
    color: '#1DB954',
  },

  cardProgresso: {
    backgroundColor: '#16211A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  cardLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitulo: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  cardValor: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
  },

  linhaSeparadora: {
    height: 1,
    backgroundColor: '#24402E',
    marginVertical: 14,
  },

  nivelTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
  },

 barraXpFundo: {
  marginTop: 14,
  height: 12,
  borderRadius: 20,
  backgroundColor: '#102015',
  overflow: 'hidden',
},

  barraXpPreenchimento: {
  height: '100%',
  backgroundColor: '#22C55E',
  borderRadius: 20,
},

  xpRestante: {
    color: '#86EFAC',
    fontSize: 12,
    marginTop: 8,
  },

  cardMissaoPrincipal: {
    backgroundColor: '#16211A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  missaoTag: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  missaoTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },

  missaoDescricao: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardMissaoSecundaria: {
  backgroundColor: '#111827',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
},

missaoSecundariaTitulo: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
  marginTop: 8,
},

missaoXp: {
  color: '#22C55E',
  fontWeight: '700',
  marginTop: 6,
},
dataLinha: {
  marginTop: 8,
},

dataTexto: {
  color: '#6FAF86',
  fontSize: 12,
  letterSpacing: 0.5,
},

avatar: {
  width: 54,
  height: 54,
  borderRadius: 27,
  backgroundColor: '#16211A',
  borderWidth: 1.5,
  borderColor: '#22C55E',
  justifyContent: 'center',
  alignItems: 'center',
},

bottomNav: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 82,
  backgroundColor: '#050A08',
  borderTopWidth: 1,
  borderTopColor: '#163322',

  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',

  paddingTop: 8,
  paddingBottom: 14,
},

navItem: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
},

navIcon: {
  fontSize: 22,
  color: '#64748B',
},

navTexto: {
  fontSize: 11,
  color: '#64748B',
  marginTop: 3,
  fontWeight: '600',
},

/* ============================
   BOTÃO PADRÃO SSS
============================ */

botaoContainer: {
  backgroundColor: '#16A34A',
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginTop: 10,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#22C55E',
  justifyContent: 'center',
  alignItems: 'center',
},

botaoTexto: {
  color: '#FFFFFF',
  textAlign: 'center',
  fontWeight: '700',
  fontSize: 15,
  letterSpacing: 0.5,
},

/* ============================
   HEADER / DATA
============================ */

header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 24,
},

/* ============================
   AVATAR DASHBOARD
============================ */

avatarContainer: {
  position: 'relative',
  width: 64,
  height: 64,
  justifyContent: 'center',
  alignItems: 'center',
},

avatarPerfilGrande: {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: '#16211A',
  borderWidth: 2,
  borderColor: '#22C55E',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
},

avatarGrandeTexto: {
  fontSize: 42,
},
avatarGlow: {
  position: 'absolute',
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: 'rgba(34,197,94,0.15)',
},


avatarNivel: {
  position: 'absolute',
  right: -2,
  bottom: -2,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#22C55E',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#0B0F0C',
},

avatarNivelTexto: {
  color: "#FFFFFF",
  fontSize: 10,
  fontWeight: "700",
},
perfilHeader: {
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 24,
},

perfilNome: {
  color: '#FFFFFF',
  fontSize: 24,
  fontWeight: '700',
  marginTop: 14,
},

perfilNivel: {
  color: '#22C55E',
  fontSize: 16,
  fontWeight: '700',
  marginTop: 6,
  letterSpacing: 1,
},

perfilXP: {
  color: '#86EFAC',
  fontSize: 13,
  marginTop: 4,
},
cardPerfil: {
  backgroundColor: '#16211A',
  borderRadius: 18,
  padding: 18,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#1F3A28',
},

statsLinha: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#203126',
},

statsLabel: {
  color: '#9CA3AF',
  fontSize: 14,
},

statsValor: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '700',
},
fotoPerfilGrande: {
  width: '100%',
  height: '100%',
  borderRadius: 55,
},
});