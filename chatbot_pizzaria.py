import pandas as pd
import os

# Limpar tela
def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

# Função para limpar valores monetários
def limpar_preco(valor):
    return float(str(valor).replace("R$", "").replace(",", ".").strip())

# Tenta carregar os dados do Excel
try:
    pizzas_df = pd.read_excel("pizzaria.xlsx", sheet_name="Pizzas")
    bordas_df = pd.read_excel("pizzaria.xlsx", sheet_name="Bordas")
    #bebidas_df = pd.read_excel("pizzaria.xlsx", sheet_name="Bebidas")

    # Padroniza os nomes das colunas para maiúsculas e sem espaços extras
    pizzas_df.columns = pizzas_df.columns.str.strip().str.upper()
    bordas_df.columns = bordas_df.columns.str.strip().str.upper()
    #bebidas_df.columns = bebidas_df.columns.str.strip().str.upper()

except Exception as e:
    print(f"Erro ao ler o arquivo Excel: {e}")
    exit()

# Verifica se os dados foram carregados corretamente
if pizzas_df.empty or bordas_df.empty:
    print("Erro: Dados não carregados corretamente. Verifique o arquivo Excel.")
    exit()

# Limpa os preços nas colunas P, M, G
for col in ["P", "M", "G"]:
    pizzas_df[col] = pizzas_df[col].apply(limpar_preco)
    bordas_df[col] = bordas_df[col].apply(limpar_preco)

# Função para escolher o tamanho da pizza
def escolher_tamanho():
    while True:
        tamanho = input("Escolha o tamanho da pizza (P, M, G): ").strip().upper()
        if tamanho in ["P", "M", "G"]:
            return tamanho
        print("Tamanho inválido. Tente novamente.")

# Função para escolher os sabores
def escolher_sabores(tamanho):
    max_sabores = 2 if tamanho in ["P", "M"] else 3
    print(f"\nSabores disponíveis para pizza {tamanho}:")
    for index, row in pizzas_df.iterrows():
        print(f"{row['CÓD']} - {row['SABOR']} (R$ {row[tamanho]:.2f})")

    sabores_escolhidos = []
    while len(sabores_escolhidos) < max_sabores:
        try:
            codigo = int(input(f"\nDigite o código do sabor {len(sabores_escolhidos)+1}: ").strip())
            sabor = pizzas_df[pizzas_df["CÓD"] == codigo]
            if not sabor.empty:
                sabores_escolhidos.append(sabor.iloc[0])
                
                # Perguntar se deseja adicionar mais um sabor
                if len(sabores_escolhidos) < max_sabores:
                    mais = input("Deseja adicionar mais um sabor? (s/n): ").strip().lower()
                    if mais != "s":
                        break
            else:
                print("Código inválido. Tente novamente.")
        except ValueError:
            print("Digite um número válido.")
    return sabores_escolhidos

# Função para escolher a borda
def escolher_borda(tamanho):
    print("\nBordas disponíveis:")
    for index, row in bordas_df.iterrows():
        print(f"{row['CÓD']} - {row['SABOR']} (P: R$ {row['P']:.2f}, M: R$ {row['M']:.2f}, G: R$ {row['G']:.2f})")

    while True:
        try:
            codigo = int(input("Digite o código da borda desejada (ou 0 para sem borda): ").strip())
            if codigo == 0:
                return None
            borda = bordas_df[bordas_df["CÓD"] == codigo]
            if not borda.empty:
                return borda.iloc[0]
            else:
                print("Código inválido.")
        except ValueError:
            print("Digite um número válido.")

# Calcula o preço final do pedido
def calcular_preco(sabores, tamanho, borda):
    soma = sum(sabor[tamanho] for sabor in sabores)
    media = soma / len(sabores)
    preco_borda = borda[tamanho] if borda is not None else 0
    return media + preco_borda

# Mostra o resumo do pedido
def exibir_resumo(sabores, tamanho, borda, total):
    print("\n🧾 Resumo do Pedido:")
    print(f"Tamanho: {tamanho}")
    print("Sabores:")
    for sabor in sabores:
        print(f" - {sabor['SABOR']} (R$ {sabor[tamanho]:.2f})")
    if borda is not None:
        print(f"Borda: {borda['SABOR']} (R$ {borda[tamanho]:.2f})")
    else:
        print("Sem borda")
    print(f"Total: R$ {total:.2f}")

# Salva o pedido em um arquivo CSV
def salvar_pedido(sabores, tamanho, borda, total):
    pedido = {
        "Tamanho": tamanho,
        "Sabores": " / ".join([sabor['SABOR'] for sabor in sabores]),
        "Borda": borda['SABOR'] if borda is not None else "Sem borda",
        "Total": round(total, 2)
    }
    df_pedido = pd.DataFrame([pedido])
    df_pedido.to_csv("pedidos.csv", mode='a', header=not os.path.exists("pedidos.csv"), index=False)

# Função principal do chatbot
def chatbot():
    print("🍕 Bem-vindo à Pizzaria ChatBot 🍕")
    while True:
        limpar_tela()
        tamanho = escolher_tamanho()
        sabores = escolher_sabores(tamanho)
        borda = escolher_borda(tamanho)
        total = calcular_preco(sabores, tamanho, borda)
        exibir_resumo(sabores, tamanho, borda, total)

        confirmar = input("\nDeseja confirmar o pedido? (s/n): ").strip().lower()
        if confirmar == "s":
            salvar_pedido(sabores, tamanho, borda, total)
            print("✅ Pedido confirmado! Obrigado por comprar conosco!")
        else:
            print("❌ Pedido cancelado.")

        novo = input("\nDeseja fazer outro pedido? (s/n): ").strip().lower()
        if novo != "s":
            print("👋 Até a próxima!")
            break

# Executa o chatbot
if __name__ == "__main__":
    chatbot()
