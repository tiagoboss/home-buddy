import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Bed, Bath, Car, Ruler, Building2, Phone, ChevronLeft, ChevronRight, Home, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

interface ImovelPublic {
  id: string;
  titulo: string;
  tipo: string;
  modalidade: string;
  preco: number;
  bairro: string | null;
  cidade: string | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  area: number | null;
  condominio: number | null;
  iptu: number | null;
  descricao: string | null;
  caracteristicas: string[] | null;
  entrega: string | null;
  construtora: string | null;
  foto: string | null;
  fotos: string[] | null;
  telefone_contato: string | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getModalidadeLabel = (modalidade: string) => {
  const labels: Record<string, string> = {
    venda: 'Venda',
    locacao: 'Locação',
    lancamento: 'Lançamento',
    temporada: 'Temporada',
  };
  return labels[modalidade] || modalidade;
};

export const ImovelPublicPage = () => {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<ImovelPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchImovel = async () => {
      if (!id) {
        setError('Imóvel não encontrado');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !data) {
        setError('Imóvel não encontrado');
      } else {
        setImovel(data as ImovelPublic);
      }
      setLoading(false);
    };

    fetchImovel();
  }, [id]);

  const allPhotos = (() => {
    if (!imovel) return ['/placeholder.svg'];
    const photos: string[] = [];
    if (imovel.foto) photos.push(imovel.foto);
    if (imovel.fotos && imovel.fotos.length > 0) {
      imovel.fotos.forEach(f => {
        if (f && !photos.includes(f)) photos.push(f);
      });
    }
    return photos.length > 0 ? photos : ['/placeholder.svg'];
  })();

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsApp = () => {
    if (!imovel) return;
    const phone = imovel.telefone_contato?.replace(/\D/g, '') || '';
    const message = `Olá! Tenho interesse no imóvel: ${imovel.titulo} - ${formatCurrency(imovel.preco)}`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getPriceDisplay = () => {
    if (!imovel) return null;
    switch (imovel.modalidade) {
      case 'locacao':
        return (
          <div>
            <span className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(imovel.preco)}</span>
            <span className="text-muted-foreground text-lg">/mês</span>
          </div>
        );
      case 'temporada':
        return (
          <div>
            <span className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(imovel.preco)}</span>
            <span className="text-muted-foreground text-lg">/diária</span>
          </div>
        );
      case 'lancamento':
        return (
          <div>
            <span className="text-sm text-muted-foreground">A partir de</span>
            <p className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(imovel.preco)}</p>
          </div>
        );
      default:
        return <span className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(imovel.preco)}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !imovel) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Home className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Imóvel não encontrado</h1>
        <p className="text-muted-foreground">O imóvel que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }

  const pageTitle = `${imovel.titulo} | ${formatCurrency(imovel.preco)}`;
  const pageDescription = `${imovel.tipo} para ${getModalidadeLabel(imovel.modalidade)} em ${imovel.bairro}, ${imovel.cidade}. ${imovel.quartos || 0} quartos, ${imovel.area || 0}m². ${imovel.descricao?.slice(0, 100) || ''}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={allPhotos[0]} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">Imobiliária</span>
            </div>
            <span className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-full">
              {getModalidadeLabel(imovel.modalidade)}
            </span>
          </div>
        </header>

        {/* Photo Gallery */}
        <section className="relative bg-muted">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <img
                src={allPhotos[currentPhotoIndex]}
                alt={`${imovel.titulo} - Foto ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/90 hover:bg-background rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/90 hover:bg-background rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allPhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-all',
                          index === currentPhotoIndex
                            ? 'bg-primary w-6'
                            : 'bg-background/70 hover:bg-background'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{imovel.titulo}</h1>
                {imovel.construtora && (
                  <p className="text-muted-foreground mb-2">🏗️ {imovel.construtora}</p>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{imovel.bairro}, {imovel.cidade}</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <Bed className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold">{imovel.quartos || 0}</span>
                  <span className="text-sm text-muted-foreground">Quartos</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <Bath className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold">{imovel.banheiros || 0}</span>
                  <span className="text-sm text-muted-foreground">Banheiros</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <Car className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold">{imovel.vagas || 0}</span>
                  <span className="text-sm text-muted-foreground">Vagas</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <Ruler className="w-6 h-6 text-primary mb-2" />
                  <span className="text-lg font-semibold">{imovel.area || 0}</span>
                  <span className="text-sm text-muted-foreground">m²</span>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="font-medium">{imovel.tipo}</span>
              </div>

              {/* Description */}
              {imovel.descricao && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
                </div>
              )}

              {/* Features */}
              {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Características</h2>
                  <div className="flex flex-wrap gap-2">
                    {imovel.caracteristicas.map((carac, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-muted rounded-full text-sm"
                      >
                        {carac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Price & Contact */}
            <div className="md:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-6">
                <div>
                  {getPriceDisplay()}
                  {imovel.modalidade === 'locacao' && (
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {imovel.condominio && <p>Condomínio: {formatCurrency(imovel.condominio)}</p>}
                      {imovel.iptu && <p>IPTU: {formatCurrency(imovel.iptu)}/ano</p>}
                    </div>
                  )}
                  {imovel.modalidade === 'lancamento' && imovel.entrega && (
                    <p className="text-sm text-muted-foreground mt-2">Entrega: {imovel.entrega}</p>
                  )}
                </div>

                {imovel.telefone_contato && (
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Fale com o Corretor
                  </button>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Interessado? Entre em contato para mais informações ou agendar uma visita.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Imobiliária. Todos os direitos reservados.</p>
          </div>
        </footer>

        {/* Fixed WhatsApp button on mobile */}
        {imovel.telefone_contato && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl font-medium"
            >
              <Phone className="w-5 h-5" />
              Fale com o Corretor
            </button>
          </div>
        )}
      </div>
    </>
  );
};